/** @jsx jsx */

import { Component } from 'react';
import { Mixpanel } from 'utils/mixpanel';
import { jsx } from 'theme-ui';

import Container from 'components/Container';
import Header from 'components/Header';

import { pagePrivacySx } from './PagePrivacyStyles';

const EmailLink = () => (
  <a href="mailto:cupids@datamatch.me">cupids@datamatch.me</a>
);
export default class PagePrivacy extends Component {
  componentDidMount() {
    Mixpanel.track('Privacy_Page', {});
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#f8f8f8' }}>
        <div className="page-privacy" sx={pagePrivacySx}>
          <Header>Privacy Policy</Header>
          <div className="privacy-body">
            <h4>Datamatch 2020 Privacy Notice</h4>
            <h5>Published February 8, 2021</h5>
            <p>
              We’ve put security measures in place to make sure that Datamatch
              users’ data is protected. This year, we implemented an overhaul of
              the security of our backend and our database to ensure that the
              only data sent to the client is data that users have explicitly
              allowed to be visible in that context. We have designed new
              privacy settings with that in mind (e.g. for gender fields
              “Private to me”, “Mutual Matches”, and “Public”). Moreover, we
              have been stringent within our organization to severely limit
              access to user data to only our technical team leads, underscore
              the importance of data privacy and security to all of our members,
              and to set up private repositories for code. This notice has also
              been emailed to all users from Datamatch 2020.
            </p>
            <h5>Vulnerabilities from Datamatch 2019 and 2020</h5>
            <p>
              We were informed on February 8, 2021 that our 2020 website had a
              potential security vulnerability. Specifically, if a user decided
              to specifically seek out the raw data returned from our backend
              Search endpoint, they would be able to find private information
              that was not displayed in the UI of the website itself: their
              email, home state/country, and gender/gender preferences. In
              addition, there were three Github repositories for data
              visualizations that included 2019 and 2020 users’ last names,
              dorms, colleges, years, bios, survey answers, Spotify profiles,
              and match data that were not made private.{' '}
              <b>
                We are unaware of any misuse of your information, but we want to
                ensure that all users are aware of this vulnerability. The
                vulnerability has been fully resolved and the repositories have
                been removed.
              </b>
              These vulnerabilities do not apply to Quarantine Datamatch or
              Meet24.
            </p>
            <h5>Security in Datamatch 2021</h5>
            <p>
              In addition to the measures detailed above, we want to be clear
              what user data is accessible (via the Search function) to other
              users and what is kept available only to the user themselves.
            </p>
            <p>
              <i>
                Public Profile Attributes (available to all users via Search):
              </i>
            </p>
            <ul>
              <li>Name</li>
              <li>Year</li>
              <li>College</li>
              <li>Bio</li>
              <li>Location (On/off campus, dorm, state/country)</li>
              <li>Profile Pic</li>
              <li>Availabilities + Preference to meet on Zoom/In-person</li>
              <li>Outtakes answers</li>
              <li>Social media</li>
            </ul>
            <p>
              <i>
                Private Profile Attributes (available only to the user
                themselves):
              </i>
            </p>
            <ul>
              <li>Email</li>
              <li>Blocklist</li>
              <li>Gender + Pronouns*</li>
              <li>Gender/Relationship type you are looking for</li>
            </ul>
            <p>
              * Users can change their privacy settings for their gender and
              pronouns profile fields. The default setting is "Private to me."
              We enforce reads to these specific attributes via Firebase
              security rules.
            </p>
            <h5>Matches:</h5>
            <p>
              You only have access to your own matches. Moreover, you can only
              read if someone has matched you only if you have matched them
              (preventing leaking of who has matched you). You cannot access a
              “search match” if you have not matched the other user.{' '}
            </p>
            <h5>Crush Roulette:</h5>
            <p>
              Only you have access to the crush pairing that you submitted to
              Crush Roulette. If you click “Remove Crush”, the crush pairing
              will be deleted from our database.
            </p>
            <h5>Deleting Your Account:</h5>
            <p>
              When you delete your account in Settings, all of the information
              from your profile page is deleted from our database. Additionally,
              as of February 8, any crush you submitted to Crush Roulette and
              your survey responses will be deleted as well.
            </p>
            <br />
            <p>
              We understand that Datamatch users trust us with sensitive
              information, and we greatly value that trust. We aim to be fully
              transparent about any privacy or security issues that may arise.
              We truly apologize for any harm that this vulnerability may have
              caused.{' '}
            </p>
            <br />

            <h3>Privacy Policy</h3>
            <div>
              <strong>Last updated: January 19, 2021</strong>
            </div>
            <div>
              This Privacy Policy describes how your personal information is
              collected, used, and shared when you visit Datamatch.me (the
              “Site”).
            </div>
            <div>
              This Privacy Policy covers our treatment of personally
              identifiable information ("Personal Information") that we gather
              when you are accessing or using our Services, but not to the
              practices of companies we don’t own or control, or people that we
              don’t manage. We gather various types of Personal Information from
              our users, as explained in more detail below, and we use this
              Personal Information internally in connection with our Services,
              including to personalize, provide, and improve our services, to
              allow you to set up a user account and profile, to contact you and
              allow other users to contact you, to fulfill your requests for
              certain products and services, and to analyze how you use the
              Services. In certain cases, we may also share some Personal
              Information with third parties, but only as described below.
            </div>
            <h4>PERSONAL INFORMATION WE COLLECT</h4>
            <h5>Information You Provide to Us:</h5>
            <div>
              We receive and store any information you knowingly provide to us.
              For example, through the registration process and/or through your
              account settings, we may collect Personal Information such as your
              name, email address, phone number, and third-party account
              credentials (for example, your log-in credentials for third party
              sites). If you provide your third-party account credentials to us
              or otherwise sign in to the Services through a third party site or
              service, you understand some content and/or information in those
              accounts (“Third Party Account Information”) may be transmitted
              into your account with us, and that Third Party Account
              Information transmitted to our Services is covered by this Privacy
              Policy. Certain information may be required to register with us or
              to take advantage of some of our features.
            </div>
            <div>
              We may communicate with you if you’ve provided us the means to do
              so. For example, if you’ve given us your email address, we may
              send you promotional email offers on behalf of other businesses,
              or email you about your use of the Services. Also, we may receive
              a confirmation when you open an email from us. This confirmation
              helps us make our communications with you more interesting and
              improve our services. If you do not want to receive communications
              from us, please indicate your preference by opting-out. For email
              communications, you can opt-out using the Unsubscribe link
              provided in the email. For Facebook Messenger messages, you can
              opt-out from your Settings page or by changing your messaging
              settings inside of the Facebook Messenger thread. For SMS
              messages, you can opt-out from your Settings page or by replying
              “Stop”.
            </div>
            <h5>Information Collected Automatically:</h5>
            <div>
              Whenever you interact with our Services, we automatically receive
              and record information on our server logs from your browser or
              device, which may include your IP address, geolocation data,
              device identification, “cookie” information, the type of browser
              and/or device you’re using to access our Services, and the page or
              feature you requested. “Cookies” are identifiers we transfer to
              your browser or device that allow us to recognize your browser or
              device and tell us how and when pages and features in our Services
              are visited and by how many people. You may be able to change the
              preferences on your browser or device to prevent or limit your
              device’s acceptance of cookies, but this may prevent you from
              taking advantage of some of our features. Our advertising partners
              may also transmit cookies to your browser or device, when you
              click on ads that appear on the Services. Also, if you click on a
              link to a third party website or service, such third party may
              also transmit cookies to you. Again, this Privacy Policy does not
              cover the use of cookies by any third parties, and we aren’t
              responsible for their privacy policies and practices. Please be
              aware that cookies placed by third parties may continue to track
              your activities online even after you have left our Services, and
              those third parties may not honor “Do Not Track” requests you have
              set using your browser or device. We may use this data to
              customize content for you that we think you might like, based on
              your usage patterns. We may also use it to improve the Services -
              for example, this data can tell us how often users use a
              particular feature of the Services, and we can use that knowledge
              to make the Services interesting to as many users as possible.
            </div>
            <h4>SHARING YOUR PERSONAL INFORMATION</h4>
            <div>
              We do not rent or sell your Personal Information in personally
              identifiable form to anyone, except as expressly provided below.
              We may share your Personal Information with third parties as
              described in this below:
            </div>
            <div>
              Information that’s been de-identified: We may de-identify your
              Personal Information so that you are not identified as an
              individual, and provide that information to our partners. We may
              also provide aggregate usage information to our partners (or allow
              partners to collect that information from you), who may use such
              information to understand how often and in what ways people use
              our Services, so that they, too, can provide you with an optimal
              online experience. However, we never disclose aggregate usage or
              de-identified information to a partner (or allow a partner to
              collect such information) in a manner that would identify you as
              an individual.
            </div>
            <div>
              Advertisers: We may allow advertisers and/or merchant partners
              (“Advertisers”) to choose the demographic information of users who
              will see their advertisements and/or promotional offers and you
              agree that we may provide any of the information we have collected
              from you in non-personally identifiable form to an Advertiser, in
              order for that Advertiser to select the appropriate audience for
              those advertisements and/or offers. For example, we might use the
              fact you are located in San Francisco to show you ads or offers
              for San Francisco businesses, but we will not tell such businesses
              who you are. Or, we might allow Advertisers to display their ads
              to users with similar usage patterns to yours, but we will not
              disclose usage information to Advertisers except in aggregate
              form, and not in a manner that would identify you personally. Note
              that if an advertiser asks us to show an ad to a certain audience
              or audience segment and you respond to that ad, the advertiser may
              conclude that you fit the description of the audience they were
              trying to reach.
            </div>
            <div>
              Affiliated Businesses: In certain situations, businesses or third
              party websites we’re affiliated with may sell or provide products
              or services to you through or in connection with the Services
              (either alone or jointly with us). You can recognize when an
              affiliated business is associated with such a transaction or
              service, and we will share your Personal Information with that
              affiliated business only to the extent that it is related to such
              transaction or service. Some such services may include the ability
              for you to automatically transmit Third Party Account Information
              to your Services profile or to automatically transmit information
              in your Services profile to your third party account, for example,
              by letting a partner restaurant know that you will be purchasing
              food for a Datamatch date on a certain day. We have no control
              over the policies and practices of third party websites or
              businesses as to privacy or anything else, so if you choose to
              take part in any transaction or service relating to an affiliated
              website or business, please review all such business’ or websites’
              policies.
            </div>
            <div>
              Our Agents: We employ other companies and people to perform tasks
              on our behalf and need to share your information with them to
              provide products or services to you; for example, we may use a
              payment processing company to receive and process your credit card
              transactions for us. Unless we tell you differently, our agents do
              not have any right to use the Personal Information we share with
              them beyond what is necessary to assist us.
            </div>
            <div>
              Business Transfers: We may choose to buy or sell assets, and may
              share and/or transfer customer information in connection with the
              evaluation of and entry into such transactions. Also, if we (or
              our assets) are acquired, or if we go out of business, enter
              bankruptcy, or go through some other change of control, Personal
              Information could be one of the assets transferred to or acquired
              by a third party.
            </div>
            <div>
              Protection of Company and Others: We reserve the right to access,
              read, preserve, and disclose any information that we reasonably
              believe is necessary to comply with law or court order; enforce or
              apply our Terms of Use and other agreements; or protect the
              rights, property, or safety of Company, our employees, our users,
              or others.
            </div>
            <h4>SECURITY OF YOUR INFORMATION</h4>
            <div>
              Your account is protected by a password for your privacy and
              security. If you access your account via a third party site or
              service, you may have additional or different sign-on protections
              via that third party site or service. You must prevent
              unauthorized access to your account and Personal Information by
              selecting and protecting your password and/or other sign-on
              mechanism appropriately and limiting access to your computer or
              device and browser by signing off after you have finished
              accessing your account.
            </div>
            <div>
              We endeavor to protect the privacy of your account and other
              Personal Information we hold in our records, but unfortunately, we
              cannot guarantee complete security. Unauthorized entry or use,
              hardware or software failure, and other factors, may compromise
              the security of user information at any time.
            </div>
            <h4>ACCESS TO YOUR PERSONAL INFORMATION</h4>
            <div>
              Through your account settings, you may access, and, in some cases,
              edit or delete the following information you’ve provided to us:
            </div>
            <ul>
              <li>name and password</li>
              <li>email address</li>
              <li>location</li>
              <li>user profile information</li>
            </ul>
            <div>
              The information you can view, update, and delete may change as the
              Services change. If you have any questions about viewing or
              updating information we have on file about you, please contact us
              at <EmailLink />.
            </div>
            <h4>WHAT YOU CAN DO TO MANAGE YOUR PRIVACY</h4>
            <div>
              You can always opt not to disclose information to us, but keep in
              mind some information may be needed to register with us or to take
              advantage of some of our features.
            </div>
            <div>
              You may be able to add, update, or delete information as explained
              above. When you update information, however, we may maintain a
              copy of the unrevised information in our records. You may request
              deletion of your account by going to your Settings page or
              emailing us at <EmailLink />. Some information may remain in our
              records after your deletion of such information from your account.
              We may use any aggregated data derived from or incorporating your
              Personal Information after you update or delete it, but not in a
              manner that would identify you personally.
            </div>
            <h4>MINORS</h4>
            <div>
              The Site is not intended for individuals under the age of 13. If
              you are under 13, please do not attempt to register for the
              Services or send any personal information about yourself to us. If
              we learn that we have collected personal information from a child
              under age 13, we will delete that information as quickly as
              possible. If you believe that a child under 13 may have provided
              us personal information, please contact us at <EmailLink />.
            </div>
            <h4>CHANGES</h4>
            <div>
              We may update this privacy policy from time to time in order to
              reflect, for example, changes to our practices or for other
              operational, legal or regulatory reasons.
            </div>
            <h4>CONTACT US</h4>
            <div>
              For more information about our privacy practices, if you have
              questions, or if you would like to make a complaint, please
              contact us by e-mail at <EmailLink />.
            </div>
          </div>
        </div>
      </Container>
    );
  }
}
