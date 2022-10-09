/** @jsx jsx */

import { Component } from 'react';
import { Mixpanel } from 'utils/mixpanel';

import { jsx } from 'theme-ui';

import { Articles } from 'constants/Press';

import Container from 'components/Container';
import Header from 'components/Header';

import { pagePressSx } from 'pages/PagePress/PagePressStyles';

export default class PagePress extends Component {
  componentDidMount() {
    // Web analytics
    Mixpanel.track('Press_Page', {});
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div sx={pagePressSx}>
        <Container>
          <Header>Press</Header>
          <div className="articles-container">
            {Articles.map(article => {
              return (
                <a target="_blank" rel="noopener noreferrer" href={article.url}>
                  <div key={article.title} className="article-row">
                    {/* if the image exists, we show that otherwise the title */}
                    {article.img && (
                      <div className="article-image-container">
                        <img
                          className="article-image"
                          alt="article"
                          src={article.img}
                          style={{
                            ...article.style,
                          }}
                        />
                      </div>
                    )}
                    <div className="article-title">{article.title}</div>
                  </div>
                  <hr className="solid line" />
                </a>
              );
            })}
          </div>
        </Container>
      </div>
    );
  }
}

// export default PagePress;
