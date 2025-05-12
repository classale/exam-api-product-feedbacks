const API_URL = "http://51.38.232.174:3002/v1",
feedbackWrapper = document.querySelector(".feedback-wrapper"),
searchForm = document.querySelector("#form-search"),
feedbackCounter = document.querySelector("#feedback-counter"),
feedbackPlural = document.querySelector("#feedback-plural")

async function fetchFeedbacks(API_URL, params = {}) {
    feedbackWrapper.innerHTML = "";

    const entries = []
    for(let [key, value] of Object.entries(params)) entries.push([key == "page" ? "pageSize" : key, value]);

    const feedbacksResp = await fetch(`${API_URL}/feedbacks?${entries.map(e => e.join("=")).join("&")}`);
    const feedbacks = await feedbacksResp.json()

    feedbackCounter.innerHTML = feedbacks.length;
    feedbackPlural.innerHTML = feedbacks.length > 1 ? "s" : "";

    for(let feedback of feedbacks) feedbackWrapper.appendChild(createFeedbackItem(feedback));
}

function createFeedbackItem(feedback) {
    const feedbackDiv = Object.assign(document.createElement("div"), {className: "feedback-item"})
    
    const feedbackVotes = feedbackDiv.appendChild(Object.assign(document.createElement("div"), {className: "feedback-item-votes"}))
    
    const votesSvg = feedbackVotes.appendChild(Object.assign(document.createElementNS("http://www.w3.org/2000/svg", "svg"), {viewbox: "0 0 24 24"}))
    
    const votesPath = votesSvg.appendChild(Object.assign(document.createElementNS("http://www.w3.org/2000/svg", "path"), {style: "fill: currentColor;"}));
    votesPath.setAttribute("d", "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z")
    
    feedbackVotes.appendChild(Object.assign(document.createElement("span"), {className: "text-regular-3", innerHTML: feedback.votes}))
    
    const feedbackText = feedbackDiv.appendChild(Object.assign(document.createElement("div"), {className: "feedback-item-text"}))
    feedbackText.appendChild(Object.assign(document.createElement("h3"), {className: "heading-3", innerHTML: feedback.title}))
    feedbackText.appendChild(Object.assign(document.createElement("p"), {innerHTML: feedback.description}))
    feedbackText.appendChild(Object.assign(document.createElement("p"), {className: "feedback-chip text-regular-3", innerHTML: feedback.category, style: "text-transform: capitalize;"}))
    
    const feedbackComments = feedbackDiv.appendChild(Object.assign(document.createElement("div"), {className: "feedback-item-comments"}))
    
    const commentSvg = feedbackComments.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
    commentSvg.classList.add("grey-lighten-1-text")
    commentSvg.setAttribute("viewBox", "0 0 24 24")
    
    const commentsPath = commentSvg.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"))
    commentsPath.setAttribute("fill", "currentColor")
    commentsPath.setAttribute("d", "M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z")
    
    feedbackComments.appendChild(Object.assign(document.createElement("span"), {className: "bold", innerHTML: feedback.comments}))
    return feedbackDiv;
}

addEventListener("DOMContentLoaded", async () => fetchFeedbacks(API_URL))

searchForm.addEventListener("submit", async e => {
    e.preventDefault();
    fetchFeedbacks(API_URL, Object.fromEntries(new FormData(searchForm).entries()))
})