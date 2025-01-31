
const Usernames: string[] = []

export function checkUserNameAvailability(username: string){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(Usernames.includes(username))
        },
    2000)
    })
}