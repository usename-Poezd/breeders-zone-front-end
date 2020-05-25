function comparerById(otherArray){
    return function(current){
        return otherArray.filter(function(other){
            return other.id == current.id
        }).length == 0;
    }
}

function comparer(arr1, arr2) {
    const onlyInKindGuards = arr1.filter(comparerById(arr2));
    const onlyInGuards = arr2.filter(comparerById(arr1));

    return onlyInKindGuards.concat(onlyInGuards);
}

export default comparer;