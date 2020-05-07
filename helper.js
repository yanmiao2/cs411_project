switch_group = (interest,group) => {
    if(group=="none"){
        if(interest[5]=='') return ''
        else return 'DONTMATCH'
    }
    switch(group){
        case "Couple":
            return "Romantic"
        case "Family":
            return "Family"
        case "Friends":
            return "Friends"
        default:
            return 'DONTMATCH'
    }
    return 'DONTMATCH'
}

convert_date = (start) => {
    start.setDate(start.getDate()+1)
    curr_date = start.toLocaleDateString()
    var idx = curr_date.indexOf("/")
    if(idx==1) curr_date = 0 + curr_date
    idx = curr_date.indexOf("/",3)
    if(idx==4) curr_date = curr_date.slice(0,3) + '0' + curr_date.slice(3,0)
    curr_date = curr_date.slice(6,10) + "-" + curr_date.slice(0,2) + "-" + curr_date.slice(3,5)
    return curr_date
}

shuffle = (result1) => {
    var i
    for(i = result1.length - 1; i > 0; i--){
        j = Math.floor(Math.random() * i)
        tempx = result1[i]
        result1[i] = result1[j]
        result1[j] = tempx
    }
}

sql_a = (budget,interest,curr_date) => {
    return "select * from Events e where e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%' or e.type LIKE '%"+interest[5]+"%') and e.date_type = '"+curr_date+"' and e.startTime<='18:00:00'"
}

sql_b = (budget,interest,curr_date) => {
    return "select * from Events e where e.price <= '"+budget+"' and (e.type LIKE '%"+interest[0]+"%' or e.type LIKE '%"+interest[1]+"%' or e.type LIKE '%"+interest[2]+"%' or e.type LIKE '%"+interest[3]+"%' or e.type LIKE '%"+interest[4]+"%' or e.type LIKE '%"+interest[5]+"%') and e.date_type = '"+curr_date+"' and e.startTime>'18:00:00'"
}
