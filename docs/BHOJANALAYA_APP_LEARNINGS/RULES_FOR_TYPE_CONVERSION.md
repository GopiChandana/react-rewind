### Rule for your conversion

#### Don't add types everywhere just because you're converting JS → TS.

#### Add explicit types when TypeScript cannot infer them, especially:

* component props
* function parameters when they aren't inferred
* useState when the initial value is ambiguous
* context types
* callback parameters where inference doesn't work


#### You have: setActiveFriendId(filtered[0].id);

and TypeScript says:

Object is possibly 'undefined'

That's because TypeScript knows filtered[0] might not exist.

Since you already know you don't want an undefined friend there, use:

#### setActiveFriendId(filtered[0]!.id);

### The ! tells TypeScript: "I know this exists here."