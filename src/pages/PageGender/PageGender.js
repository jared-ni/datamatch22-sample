/** @jsx jsx */

import { Component } from 'react';
import { jsx } from 'theme-ui';

import Container from 'components/Container';
import Header from 'components/Header';

import { Mixpanel } from 'utils/mixpanel.js';

import { genderSx } from 'pages/PageGender/PageGenderStyles';

export default class PageGender extends Component {
  componentDidMount() {
    // Web analytics
    Mixpanel.track('Gender_Page', {});
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#f8f8f8' }}>
        <div className="page-gender" sx={genderSx}>
          <Header>Gender Policy</Header>
          <div className="gender-section">
            <i>
              We acknowledge that gender and sexuality are nuanced concepts, and
              Datamatch as a program cannot fully capture the complexity of the
              topic. If you have any questions, suggestions, or complaints,
              please do not hesitate to contact{' '}
              <a href="mailto:cupids@datamatch.me">cupids@datamatch.me</a> -- we
              are always open to input and always will be.
            </i>
          </div>
          <h4>Key Goals</h4>
          <div className="gender-section">
            <ul>
              <li>
                Treat everyone equally within the context of matching by
                building in a non-binary gender option.
              </li>
              <li>
                Provide everyone the opportunity to self-describe gender
                identity.
              </li>
              <li>
                Allow everyone the ability to express their matching preferences
                to the greatest extent possible.
              </li>
              <li>
                Make everyone excited for Datamatch by creating an awesome
                product.
              </li>
            </ul>
          </div>
          <h4>Self-description</h4>
          <div className="gender-section">
            <ul>
              <li>
                Users will be required to select one of three categories for
                which gender they want the algorithm to treat them as. These
                will be from the set Man, Woman, and Non-binary person.
              </li>
              <li>
                In addition to selecting one of these three categories, users
                will be able to add a limited amount of text (100 characters) to
                describe their gender identity.
                <ul>
                  <li>
                    This additional description will be optional, and available
                    to people who identify with any of the three larger gender
                    categories.
                  </li>
                </ul>
              </li>
              <li>
                Users will be able to set privacy settings for the visibility of
                their gender identity: their gender identity will either be kept
                private, public (visible on search and for all matches), or
                visible for mutual matches only.
              </li>
              <li>
                Users will also be able to select their preferred pronouns, from
                either a list of common pronouns, custom input, or "prefer not
                to show". Preferred pronouns will be displayed publicly on a
                user's profile unless they select "prefer not to show".
              </li>
            </ul>
          </div>
          <h4>Matching</h4>
          <div className="gender-section">
            <ul>
              <li>
                Users will be matched based on how they self identify from among
                the three categories above.
              </li>
              <li>
                Users will be able to select types of matches that they are
                seeking: romantic, friendship, and both romantic and
                friendshiip.
              </li>
              <li>
                For each type of match, users will select gender preferences
                through selecting any one, two or three of the three gender
                categories they prefer to be match eligible with.
              </li>
              <li>
                For each type of match, users will be matched with people from
                among the genders that they indicated being interested in who
                also expressed interest in people of that user’s gender. Match
                results will indicate the type that the match corresponds to.
              </li>
              <li>
                In the Settings page, users will be able to specify emails for
                up to 10 people who they would prefer not to be matched to.
                Those blocked users will never appear in a user's matches,
                regardless of the nature of the match.
              </li>
            </ul>
          </div>
          <h4>Language:</h4>
          <div className="gender-section">
            <ul>
              <li>
                Datamatch will not use gender to summarize a match.
                <ul>
                  <li>
                    NO: “Your match Russell is a junior male living in
                    Leverett.”
                  </li>
                  <li>
                    YES: “Your match Russell is a junior living in Leverett.”
                  </li>
                </ul>
              </li>
              <li>
                Datamatch will not use gender within our officially crafted
                publicity materials, unless it includes references to all three
                gender subcategories equally.
                <ul>
                  <li>NO: “Hey guys and gals come get a waffle!”</li>
                  <li>YES: “Waffles anyone?!”</li>
                </ul>
              </li>
            </ul>
          </div>
          <h4>Periphery Implications</h4>
          <div className="gender-section">
            <li>
              Datamatch will follow exactly these guidelines at all schools.
            </li>
          </div>
        </div>
      </Container>
    );
  }
}
