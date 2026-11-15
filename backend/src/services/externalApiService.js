
// Service to fetch live repository metadata from GitHub public API
const getClubRepositoryStats = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch("https://api.github.com/repos/diyadawra25cse-wq/BMU-TECH-CLUB", {
      headers: {
        "User-Agent": "BMU-Tech-Club-Portal",
        "Accept": "application/vnd.github.v3+json"
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        status: "online",
        live: true,
        source: "https://api.github.com",
        data: {
          repoName: data.name,
          fullName: data.full_name,
          stars: data.stargazers_count,
          forks: data.forks_count,
          openIssues: data.open_issues_count,
          license: data.license ? data.license.spdx_id : "None",
          description: data.description,
          htmlUrl: data.html_url,
          pushedAt: data.pushed_at
        }
      };
    }

    // Honest handling of non-200 responses (e.g. rate limit, 404, etc.)
    return {
      status: "unavailable",
      live: false,
      message: `External GitHub API returned status code ${response.status}`,
      statusCode: response.status
    };

  } catch (error) {
    clearTimeout(timeoutId);
    return {
      status: "unavailable",
      live: false,
      message: error.name === "AbortError" 
        ? "External GitHub API request timed out." 
        : "External GitHub API is currently unreachable (network offline or restricted).",
      error: error.message
    };
  }
};

module.exports = {
  getClubRepositoryStats
};
