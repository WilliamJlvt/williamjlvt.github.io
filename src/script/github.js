const githubAPI = 'https://api.github.com/users/WilliamJlvt/repos';
let repos = [];
let reposLanguage = [];
const language_icons = {
    "C": "assets/languages/c.png",
    "C++": "assets/languages/cpp.png",
    "Go": "assets/languages/golang.png",
    "Java": "assets/languages/java.png",
    "JavaScript": "assets/languages/javascript.png",
    "python": "assets/languages/python.png",
    "Makefile": "assets/languages/makefile.png",
    "HTML": "assets/languages/html.png",
    "CSS": "assets/languages/css.png",
}

function init_repo(repo) {
    if (!repo.topics.includes('pinned') && repo.languages_url == null)
        return false;
    fetch(repo.languages_url)
        .then(response => response.json())
        .then(data => {
            reposLanguage[repo.name] = data;
            displayRepos();
            return true;
        });
    return false;
}

function fetchGitHubData() {
    fetch(githubAPI)
        .then(response => response.json())
        .then(data => {
            repos = data;
            for (const repo of data)
                init_repo(repo);
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
        repoName.classList.add('repo-name');
        if (repo.language) {
            const languageIcon = document.createElement('img');
            languageIcon.src = language_icons[repo.language];
            languageIcon.className = `repo_language_icon`;
            repoName.appendChild(languageIcon);
        }
        repoNameText.textContent = repo.name;
        repoName.appendChild(repoNameText);
        repoBox.appendChild(repoName);

        const description = document.createElement('p');
        description.textContent = repo.description;
        description.className = 'repo-escription';
        repoBox.appendChild(description);
        if (repo.description != null)
            repoBox.appendChild(document.createElement('br'));

        const creationDate = document.createElement('p');
        const updatedAt = new Date(repo.updated_at);
        creationDate.textContent = getTranslation("repos.updated_at") + `${formatDate(updatedAt)}`;
        repoBox.appendChild(creationDate);
        repoBox.appendChild(document.createElement('br'));

        const languagesDiv = document.createElement('div');
        languagesDiv.className = 'repo-languages';

        let size = 0;
        if (reposLanguage[repo.name] != null) {
            let total = 0;
            for (const language in reposLanguage[repo.name]) {
                total += reposLanguage[repo.name][language];
            }
            for (const language in reposLanguage[repo.name]) {
                size++;
                if (size > 3)
                    break;
                let percentage = (reposLanguage[repo.name][language] / total) * 100;
                const languageDiv = document.createElement('div');
                const languageIcon = document.createElement('img');
                languageIcon.src = language_icons[language];
                languageDiv.appendChild(languageIcon);
                languagesDiv.appendChild(languageDiv);
                const languageP = document.createElement('p');
                languageP.textContent = `${language}: ${percentage.toFixed(1)}%`;
                languageDiv.appendChild(languageP);
                languagesDiv.appendChild(languageP);
            }
        }
        repoBox.appendChild(languagesDiv);

        listItem.appendChild(repoBox);
        repoList.childNodes[index] ? repoList.replaceChild(listItem, repoList.childNodes[index]) : repoList.appendChild(listItem);
        index++;
    }
}
