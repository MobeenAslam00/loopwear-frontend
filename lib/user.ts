export function role():any {
    const role = localStorage.getItem("role")
    if(role && role!=null){
        return role 
    }
    return
}