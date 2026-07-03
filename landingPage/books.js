const oldBooks = [

    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    
    "Joshua",
    "Judges",
    "Ruth",
    
    "1 Samuel",
    "2 Samuel",
    
    "1 Kings",
    "2 Kings",
    
    "1 Chronicles",
    "2 Chronicles",
    
    "Ezra",
    "Nehemiah",
    "Esther",
    
    "Job",
    "Psalms",
    "Proverbs",
    "Ecclesiastes",
    "Song of Solomon",
    
    "Isaiah",
    "Jeremiah",
    "Lamentations",
    "Ezekiel",
    "Daniel",
    
    "Hosea",
    "Joel",
    "Amos",
    "Obadiah",
    "Jonah",
    "Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    "Zechariah",
    "Malachi"
    
    ];
    
    const newBooks = [
    
    "Matthew",
    "Mark",
    "Luke",
    "John",
    
    "Acts",
    
    "Romans",
    
    "1 Corinthians",
    "2 Corinthians",
    
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    
    "1 Thessalonians",
    "2 Thessalonians",
    
    "1 Timothy",
    "2 Timothy",
    
    "Titus",
    "Philemon",
    
    "Hebrews",
    
    "James",
    
    "1 Peter",
    "2 Peter",
    
    "1 John",
    "2 John",
    "3 John",
    
    "Jude",
    
    "Revelation"
    
    ];
    
   function makeLinks(list, id) {

    let html = '<div class="book-grid">';

    list.forEach(book => {

        let folder = book
            .toLowerCase()
            .replace(/ /g, "")
            .replace("1", "1")
            .replace("2", "2")
            .replace("3", "3");

        html += `
            <a href="${folder}/index.html" class="book-link" target="_blank">
                ${book}
            </a>
        `;

    });

    html += '</div>';

    document.getElementById(id).innerHTML = html;
}
    
    makeLinks(oldBooks,"oldBooks");
    
    makeLinks(newBooks,"newBooks");