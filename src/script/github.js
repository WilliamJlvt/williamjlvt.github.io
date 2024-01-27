const githubAPI = 'https://api.github.com/users/WilliamJlvt/repos';
let repos = [];

const language_icons = {
    "C": "assets/languages/c.png",
    "C++": "assets/languages/cpp.png",
    "Go": "assets/languages/golang.png",
    "Java": "assets/languages/java.png",
    "JavaScript": "assets/languages/javascript.png",
    "python": "assets/languages/python.png",
}

function fetchGitHubData() {
    fetch(githubAPI)
        .then(response => response.json())
        .then(data => {
            repos = data;
            displayRepos();
        })
        .catch(error => {
            document.getElementById('repoList').innerHTML = getTranslation("error.github");
            console.error('Error fetching GitHub data:', error);
        });
    displayRepos();
}

function displayRepos() {
    const repoList = document.getElementById('repoList');
    let index = 0;

    for (const repo of repos) {
        if (!repo.topics.includes('pinned'))
            continue;
        const listItem = document.createElement('li');
        const repoBox = document.createElement('a');
        repoBox.href = repo.html_url;
        repoBox.target = '_blank';

        const repoName = document.createElement('div');
        const repoNameText = document.createElement('h4');
        repoName.classList.add('repoName');
        if (repo.language) {
            const languageIcon = document.createElement('img');
            languageIcon.src = language_icons[repo.language];
            languageIcon.className = `repo_language_icon`;
            repoName.appendChild(languageIcon);
        }
        repoNameText.textContent = repo.name;
        repoName.appendChild(repoNameText);

        const description = document.createElement('p');
        description.textContent = repo.description;
        description.className = 'repoDescription';

        const creationDate = document.createElement('p');
        const updatedAt = new Date(repo.updated_at);
        creationDate.textContent = getTranslation("repo.updated_at") + `${formatDate(updatedAt)}`;

        repoBox.appendChild(repoName);
        repoBox.appendChild(description);
        if (repo.description != null)
            repoBox.appendChild(document.createElement('br'));
        repoBox.appendChild(creationDate);
        listItem.appendChild(repoBox);

        repoList.childNodes[index] ? repoList.replaceChild(listItem, repoList.childNodes[index]) : repoList.appendChild(listItem);
        index++;
    }
}
