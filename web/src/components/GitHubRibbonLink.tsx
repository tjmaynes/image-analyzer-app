import React from 'react'

type GitHubRibbonProps = {
  project: string
}

export const GitHubRibbonLink = ({ project }: GitHubRibbonProps) => (
  <div className="github-ribbon">
    <a href={`https://github.com/${project}`}>
      <img
        decoding="async"
        width="149"
        height="149"
        src="https://github.blog/wp-content/uploads/2008/12/forkme_left_red_aa0000.png?resize=149%2C149"
        className="attachment-full size-full"
        alt="Fork me on GitHub"
        loading="lazy"
        data-recalc-dims="1"
      />
    </a>
  </div>
)
