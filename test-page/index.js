LOCALHOST = "http://localhost:3000"

const fetchQuote = () => {
    let quote = fetch(LOCALHOST + "/random")
    .then(response => { response.json()
    .then(data => {
            document.getElementById("quote").innerHTML = data.quote;
            document.getElementById("author").innerHTML = data.author;
        });
    });
};

const onLoad = () => {
    document.getElementById("postQuote").addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {};
        formData.forEach((value, key) =>  {
            data[key] = value;
        });
        fetch(LOCALHOST + "/store", {method: 'POST', body: JSON.stringify(data)});
    });
};