// 2. Async Data Fetch Grouping (The Microtask Pipeline)

// Modern frontend applications rely on network requests. 
// A top-tier interview variant forces you to resolve external metadata for each item
// before grouping the final dataset.

// The Scenario: You have a list of user IDs. 
// You must fetch their full profiles asynchronously from an API, 
// then group them by their subscription status.

// The Trick: You cannot use a synchronous loop (forEach or reduce) directly 
// because the data isn't ready. You must resolve the data pipeline using Promise.all first,
// then chain it into your standard reduce aggregator.

// Scenario:You are developing a user analytics dashboard.
// You have an array of unique user IDs.
// To gather details about these users, you must query an external database via a mock network
// function, fetchUserProfile(id), which returns a Promise resolving to a profile object 
// (e.g., { name: "Alex", status: "Premium" }).

// Task:Write an asynchronous function fetchAndGroupUsers(ids) that fetches all user profiles
// concurrently to maximize network efficiency. 
// Once all profiles are fetched, use an array method to aggregate and 
// group the retrieved users by their subscription status.

// Mock API call returning a Promise


const mockDB = {
    1: { name: "Alex", status: "Premium" },
    2: { name: "Blake", status: "Free" },
    3: { name: "Casey", status: "Premium" }
  };
const fetchUserProfile = (id) => {
  return new Promise(resolve => setTimeout(() => resolve(mockDB[id]), 50));
};

let userIds = Object.keys(mockDB)
userIds = userIds.map((id)=>Number(id))
// console.log(userIds)

const fetchAndGroupUsers = async (ids) =>{
    const profiles = await Promise.all(ids.map(id=>fetchUserProfile(id)))
    // console.log(profiles)
    const res = profiles.reduce((acc,curr)=>{
        const toCheck = curr.status
        if(acc[toCheck]){
           acc[toCheck].push(curr)
        }else{
            acc[toCheck] = [curr]
        }
        return acc;  
    },{})
    return res
}
fetchAndGroupUsers(userIds).then((res)=> console.log(JSON.stringify(res,null,2)))
