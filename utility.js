export function isValidHttpUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

export function sortBookmark(arr, keyword) {
    return arr
        // 0. keyword를 포함하지 않으면 제외
        .filter(str => str.includes(keyword))
        // 1. 정렬
        .sort((a, b) => {
        const aIndex = a.indexOf(keyword);
        const bIndex = b.indexOf(keyword);

        // 완전히 같은 문자열 우선
        if (a === keyword && b !== keyword) return -1;
        if (b === keyword && a !== keyword) return 1;

        // keyword가 더 앞에 등장하는 것 우선
        if (aIndex !== bIndex) return aIndex - bIndex;

        // 길이가 짧은 것 우선
        if (a.length !== b.length) return a.length - b.length;

        // 사전순
        return a.localeCompare(b);
        });
}
