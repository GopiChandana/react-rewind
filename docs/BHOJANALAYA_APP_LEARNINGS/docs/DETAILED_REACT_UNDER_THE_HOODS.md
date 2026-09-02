To truly master React for mid-to-senior technical interviews, you must understand exactly how React operates under the hood. Senior engineering interviews focus heavily on runtime mechanics: how React schedules tasks, handles memory, updates the browser DOM, and syncs execution contexts.
Here is the definitive guide to React Under the Hood across all core execution scenarios.

### 1. The Core Architecture: Fiber & The Two Phases
Before React 16, updates were synchronous and un-interruptible (Stack Reconciler). If React had to update 10,000 components, it would block the browser's main thread, causing visible lag.
Modern React uses the Fiber Architecture, which breaks down execution work into small units called Fibers. A Fiber is simply a plain JavaScript object that models a component's state, props, and its place in the UI tree.
React splits its execution loop into two distinct phases:
```
                  ┌──────────────────────────────────────────┐
                  │              RENDER PHASE                │
                  │  (Asynchronous, Interruptible, Pure)     │
                  └────────────────────┬─────────────────────┘
                                       │
                                       ▼
                  ┌──────────────────────────────────────────┐
                  │             COMMIT PHASE                 │
                  │ (Synchronous, Un-interruptible, Mutates) │
                  └──────────────────────────────────────────┘
```
### The Render Phase (Asynchronous & Interruptible)

* What happens: React starts at the root of your app and traverses down the Fiber tree. It calls your component functions, evaluates new props/state, and computes a new virtual tree blueprint.
* Under the hood: This phase is completely internal and pure (it does not touch the real browser DOM). Because it is calculated in memory, React can pause this phase if a high-priority user interaction (like typing or a click) comes in, handle the interaction, and then resume or throw away the background work. This is the foundation of useTransition and useDeferredValue.

### The Commit Phase (Synchronous & Un-interruptible)

* What happens: React takes the finalized diff calculation from the Render Phase and physically modifies the actual browser DOM.
* Under the hood: This phase is strictly synchronous. It cannot be interrupted because stopping halfway through would leave the user looking at a broken, partially updated webpage layout.


### 2. How useState and Hooks Work in Memory
When you declare a hook, how does React track which state belongs to which component variable? It uses a Singly Linked List attached directly to the component's active Fiber node.
### The Memory Data Structure
Every Fiber node has a internal hidden property called memoizedState.

* When your component mounts, React runs your hooks in sequence.
* It creates a linked list node for each hook call, referencing the value and pointing to the next hook.
```
FiberNode.memoizedState ──► [ Hook 1: useState ]
                             │ (state: "dark", queue: [])
                             ▼
                            [ Hook 2: useEffect ]
                             │ (deps: [], destroy: fn)
                             ▼
                            [ Hook 3: useMemo ]
                             (value: 42, deps: [x])
```
### Why Hook Rules Exist (The Interview Answer)
Because React relies entirely on pointer arrays and next-links, it has no semantic key identifier for your variables. It only knows that “Hook #1 is the theme string, and Hook #2 is the analytics side-effect.”
If you place a hook inside an if condition:

   1. On render 1: Condition is true → Hooks executed: 1, 2, 3.
   2. On render 2: Condition is false → Hook 2 is skipped. Hook 3 executes second.
   3. The Crash: React reads the memory block for Hook 2 but processes it with the execution code of Hook 3. The state variables mismatch, memory pointers shift, and React instantly breaks.


### 3. How React Context Works Under the Hood
React Context is implemented inside the Fiber reconciliation engine as a Dependency Subscription Graph.
```
                   ┌──────────────────────────────┐
                   │  ThemeContext.Provider Fiber │
                   │  value: "dark"               │
                   └──────────────┬───────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌──────────────────┐                              ┌──────────────────┐
│  Component A     │                              │  Component B     │
│  (No Context)    │                              │  (useContext)    │
└──────────────────┘                              └────────┬─────────┘
                                                           │
                                                           ▼
                                                  Registers Dependency Pointer
                                                  on Provider's update list
```
### The Subscription Loop

   1. When a component calls useContext(MyContext), React tags that component’s Fiber node with a special dependency flag. It registers a pointer directly linking this child back to the upstream Provider Fiber.
   2. When the value prop on the `<MyContext.Provider>` component changes, React doesn't just re-render everything down the tree blindly. It scans the Provider’s dependency pointers.
   3. It directly marks all matching consumer Fiber nodes as "dirty/scheduled for work".
   4. During the subsequent Render phase, React forces those specific components (and their unoptimized descendants) to execute, updating their local layout models.


### 4. Scheduling Concurrent Rendering (useTransition / useDeferredValue)
In standard React, all updates are processed with the same level of urgency. React 18 introduced a Priority-Based Scheduler (using time-slicing and cooperative scheduling mechanics).
React assigns a priority level to tasks using lanes (bitmasks representing importance):

* Immediate/Sync Lane: Direct user inputs, keystrokes, UI animations.
* Transition Lane: Searching, database filtering, heavy component tree generation.

### Under the Hood of useTransition
When you wrap an action inside startTransition(() => { setHeavyData(data); }):

   1. React marks the resulting state changes with a low-priority Transition Lane tag.
   2. It yields control back to the browser immediately using native window scheduling APIs (MessageChannel or requestIdleCallback).
   3. React computes the heavy rendering work in 5ms chunks. If a chunk ends and the user inputs a new keystroke, React halts the transition computation completely, switches to the high-priority input event render path, draws the typed letter smoothly, and then resumes the background transition calculation from scratch using the new state.


### 5. The Virtual DOM & Reconciliation Engine
The phrase "Virtual DOM" is a simplified concept. Under the hood, React implements this through a process called Reconciliation, utilizing two trees simultaneously: The Work-In-Progress (WIP) Tree and The Current Tree. This structure is called Double Buffering.
```
[ Current Tree ]   ◄─── (What the user currently sees on screen)
       │
   Reconciler compares nodes using diffing algorithm
       ▼
[ WIP Tree ]       ◄─── (Constructed asynchronously in memory during Render Phase)
       │
   Swapped instantly on commit phase completion
       ▼
[ Browser DOM ]    ◄─── (Updated in one single efficient batch mutation)
```
### The Diffing Algorithm Strategy
Comparing two complete trees has a computational complexity of O(n³). To make this fast enough to run 60 times a second, React implements a heuristic O(n) strategy based on two rules:

   1. Different Types Produce Different Trees: If a <div> changes to a <span>, React doesn't bother looking inside. It destroys the entire sub-tree root and builds it again from scratch.
   2. Keys Guide Identity Match: When rendering lists, React uses the key prop to match elements across renders.
   * Why index keys are bad for sorting: If you delete the first item in an array, and use array indexes as keys, the second item now inherits index 0. React checks the key tracker, thinks the data changed but the identity stayed the same, and fails to animate or update form field balances correctly. Unique, stable string keys isolate the identification node precisely.
   

### The Interview Summary Cheat-Sheet
If an interviewer asks you to describe how React handles an update, use these phases to structure your response:

   1. Trigger: A state change or provider update assigns a priority lane to a Fiber node.
   2. Schedule: The React Scheduler assigns a time-slice budget for processing.
   3. Render Phase: React builds a virtual Work-In-Progress tree in memory. This phase can be split or paused if concurrent flags like useTransition are present.
   4. Reconcile: The diffing algorithm determines exactly what changed using component types and unique keys.
   5. Commit Phase: The structural modifications are flushed synchronously to the actual browser layout engine in one smooth step, and lifecycle cleanups/effects run immediately after.

### Part 1: What Exactly is Concurrent Rendering?
Before React 18, rendering was a blocking transaction. Once React started rendering your UI component tree, it would not stop until it was finished. If you had a massive page update, the browser's main thread would lock up, making the page look frozen (clicks and typing wouldn't register).
Concurrent Rendering means React can work on multiple versions of your UI at the exact same time behind the scenes.
Instead of processing everything in one giant chunk, React breaks rendering down into tiny microscopic tasks (typically 5ms chunks).

* It checks the browser's main thread after every chunk.
* If a user types a letter or clicks a button, React pauses the heavy background render.
* It jumps out, handles the urgent user interaction smoothly, and then jumps back in to resume or restart the background task.

In short, it changes React from a single-track assembly line into a smart system that can multi-task without slowing down the screen.

### Part 2: How It Handles API Race Conditions
A Race Condition happens when multiple network requests are fired in sequence, but they finish out of order.
### ❌ The Race Condition Scenario (Standard React)

   1. You click on a user profile named Alice (App fires API Request #1).
   2. The network lags. You quickly click on a user profile named Bob (App fires API Request #2).
   3. API Request #2 finishes fast. The screen updates and shows Bob's profile.
   4. API Request #1 finishes late. The screen suddenly overwrites Bob and displays Alice's old data, even though Bob's button is highlighted!

### 🛡️ How Concurrent Rendering + Modern Tools Fix This
If you use modern concurrent tools like Suspense, useDeferredValue, or data libraries built on top of them (like TanStack Query), React fixes this problem natively through two mechanisms: Abandonment and Abort Signals.
```
User Clicks Alice (Request 1 Started) ──► React begins generating Alice WIP Tree 
                                                 │
User Clicks Bob (Request 2 Started)   ──► React ABANDONS Alice WIP Tree completely 
                                          and throws it away in memory!
                                                 │
Request 2 Finishes First              ──► React commits Bob WIP Tree to screen
                                                 │
Request 1 Finishes Late               ──► Rejected. The tree it was meant for 
                                          does not exist anymore.
```
### Code Implementation: The Senior Defense (Cleanup functions)
If you are interviewing for a role that doesn't use third-party libraries, you must show you can prevent race conditions using useEffect cleanup blocks and native AbortController streams.
```
import React, { useState, useEffect } from 'react';
export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Create a native browser controller to abort network requests
    const controller = new AbortController();
    let isCurrentRequest = true;

    async function fetchData() {
      try {
        const response = await fetch(`/api/users/${userId}`, { 
          signal: controller.signal // Link the fetch request to the controller
        });
        const data = await response.json();
        
        // 2. Only update state if the user hasn't switched components/IDs
        if (isCurrentRequest) {
          setUser(data);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Fetch failed:", err);
        }
      }
    }

    fetchData();

    // 3. CLEANUP FUNCTION: Runs immediately when 'userId' changes
    return () => {
      isCurrentRequest = false; // Invalidates the old request response
      controller.abort();       // Physically cancels the network request in the browser tab
    };
  }, [userId]);

  if (!user) return <p>Loading profiles...</p>;
  return <h1>{user.name}</h1>;
}
```
