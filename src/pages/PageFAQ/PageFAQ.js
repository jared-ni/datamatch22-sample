/** @jsx jsx */

import { Component } from 'react';
import { jsx } from 'theme-ui';
import { Link } from 'react-router-dom';

import Container from 'components/Container';
import Header from 'components/Header';

import { Mixpanel } from 'utils/mixpanel.js';

import { pageFAQSx } from 'pages/PageFAQ/PageFAQStyles';

export default class PageFAQ extends Component {
  state = {};

  // content has a key (which is the section title) and then HTML div that includes the contents of that section
  content = {
    'About Datamatch': (
      <div>
        <h4>
          What <i>exactly</i> is Datamatch? Without the jokes, please.
        </h4>
        <p>
          Datamatch is a free matchmaking service created for college students
          by college students to find true love. Back in 1994, a bunch of
          Harvard students banded together to make this matchmaking system a
          reality for their campus – but as of recently, Datamatch has now
          spread to over 30 schools, with plans to expand to more! Take our
          survey and leave it to us and our top secret Algorithm™ to find you
          true love (or friendship!). This is primarily meant to be humorous and
          casual, but there's always a chance of finding a lasting relationship.
          It has become a tradition across colleges, with over tens of thousands
          of students signing up every year. If you are curious about
          participating, you can read more in the FAQ section "The Process." You
          can also read about us{' '}
          <Link to={this.props.landing ? '/press' : '/app/press'}>
            in some articles here!
          </Link>
        </p>
        <h4>Thank god, I'm so lonely! Can I participate in Datamatch?</h4>
        <p>
          If cuffing season didn't do you right, we're here to help! If you are
          a student with a school email account at these schools, we'd love to
          have you participate:
        </p>
        <ul>
          <li>Brown</li>
          <li>Bowdoin</li>
          <li>Caltech</li>
          <li>Carleton</li>
          <li>Carnegie Mellon</li>
          <li>Columbia</li>
          <li>Claremont Colleges (5 schools)</li>
          <li>Dartmouth</li>
          <li>Emory</li>
          <li>FIT</li>
          <li>Furman</li>
          <li>Harvard</li>
          <li>Harvard Grad Schools</li>
          <li>Macalester College</li>
          <li>McGill</li>
          <li>Iowa</li>
          <li>LMU</li>
          <li>MIT</li>
          <li>Northeastern</li>
          <li>NYU</li>
          <li>Oregon State</li>
          <li>Princeton</li>
          <li>Smith</li>
          <li>Tufts</li>
          <li>Queens</li>
          <li>UChicago</li>
          <li>University of Illinois Chicago</li>
          <li>UPenn</li>
          <li>UCLA</li>
          <li>USC</li>
          <li>UC Berkeley</li>
          <li>UC Davis</li>
          <li>UC San Diego</li>
          <li>University of Toronto</li>
          <li>UW Madison</li>
          <li>Vanderbilt</li>
          <li>WashU</li>
          <li>Yale</li>
        </ul>
        <h4>
          I'm not a student at one of these schools. Is there any way I can take
          the survey?
        </h4>
        <p>
          We know, we love spreading love, and heaven knows your campus needs
          more of it. We know how it feels. We're trying our best to expand, but
          haven't quite gotten to your school yet. Sorry, booboo. But do see the
          next question!
        </p>
        <h4>
          I'd like to bring Datamatch to [insert institution for make people
          much smart here]. How do?
        </h4>
        <p>
          Ooh! Ooh! We did that! And maybe we could do more of that! Sharing the
          joy of Datamatch is a high priority for us. Just contact us{' '}
          <a href="mailto:cupids@datamatch.me">cupids@datamatch.me</a> directly
          and we can work something out. Preferred modes of communication
          include telegram, snail mail (use of real snails encouraged), and{' '}
          <a
            href="http://www.pigeongram.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            carrier pigeon
          </a>
          .
        </p>
        <h4>
          Okay, I go to one of the above schools. But what if I'm not on campus?
        </h4>
        <p>
          Great question! Thankfully, this year, we're offering a limited number
          of <b>free virtual dates</b> available to students at every school we
          operate at. We're paying beaucoup bucks for these, so you better start
          chatting those matches!
        </p>
        <h4>How does COVID-19 impact things?</h4>
        <p>
          It is precisely during times of great peril and crisis that Datamatch
          shines brightest! With that being said, we do not encourage any
          interactions that risk spreading COVID-19 or go against public health
          measures. Please follow your school or local area's official
          guidelines! Our virtual date options are available and encouraged for
          everyone.
        </p>
        <p>Be smart about it! Think with your head, not your *****!</p>
        <h4>
          So you keep saying “Matchmaking excellence since 1994.” And you also
          keep saying 2022 is the 27th Datamatch. But hold on a second...
        </h4>
        <p>
          Oof. Yeah, math. We're not so great. But actually! The 1997 Datamatch
          was cancelled after an incident involving our server systems, three
          bottles of Chardonnay, an unwise dare, and a pair of women’s
          pantyhose. We don’t like to talk about it.
        </p>
        <h4>What's your legal policy? Fair use policy?</h4>
        <p>Here's our expanded legal policy:</p>
        <div className="legal">
          No purchase necessary. Void in wacko states like Ohio and Michigan and
          where prohibited by law. Keep out of reach of children. Datamatch not
          liable for negligible use, unless consequences were good. Wait 2 hours
          after breaking up to use. Do not combine with alcohol. Do not operate
          heavy machinery while under the effects of Datamatch. Any views or
          opinions expressed therein are completely hilarious. Datamatch is
          provided as is without warranty. Copyright 1636.
        </div>
        <p>
          Otherwise, our current team policy, and the one we hope all Datamatch
          users will abide by is, "BE A GOOD PERSON." For 2022, we additionally
          hope users will spread love, not COVID-19. As for fair use, consider
          all users to receive a free permit from us.
        </p>
        <p>
          PS:{' '}
          <Link to={this.props.landing ? '/terms' : '/app/terms'}>Here</Link>{' '}
          are our full serious terms of service.
        </p>
        <h4>What happens to my information? Is it private?</h4>
        <p>
          Don't worry, we don't share your information with Facebook!! The
          Datamatch team personally touches your information only as much as is
          necessary to develop the Algorithm&trade; and resolve user issues.
          That promise extends to dating and social network information as well.
          We may collect some anonymous stats like usage statistics, but your
          name and contact info will be completely separate from such reports.{' '}
          <Link to={this.props.landing ? '/privacy' : '/app/privacy'}>
            Here's
          </Link>{' '}
          our privacy policy.
        </p>
      </div>
    ),
    'The Process': (
      <div>
        <h4>When does the survey open? When do results come out?</h4>
        <p>
          The survey opens at 12:01 AM EST on February 7th; the survey then
          closes a week later, on Valentine's Day at 12:01 AM EST. Results come
          out in the early morning: stay posted!
        </p>
        <h4>I'm still a bit confused. What exactly do I have to do?</h4>
        <p>
          Just register and login using your college email, fill out your basic
          user info, our specially designed survey, and wait until February 14th
          for results to be released!
        </p>
        <h4>What do I do after results are released?</h4>
        <p>
          You will receive around 10 other users that the algorithm will have
          matched you with! Then, for the people you might want to meet or sound
          vaguely interesting, you can hit “Match” to express interest. The
          other person won’t know if you hit match! The only way they’ll know is
          if they also hit match—then, it’ll show that you have mutually
          matched.
        </p>
        <h4> What can I do with my mutual matches?</h4>
        <p>
          Afterwards, contact your matches using the website’s chat feature,
          through the social media handles they shared, or in whatever way you'd
          like. If it is safe to do so, find a time to meet up for a free date*,
          or strike the conversation up through Zoom!. We certainly hope you
          won't do nothing, though, and will trust the system...{' '}
        </p>
        <p>*Free dates currently available in limited quantities!</p>

        <h4>Free dates? Explain how!</h4>
        <p>
          Datamatch can be exchanged for{' '}
          <a
            href="https://youtu.be/dgct3Jn8pFA?t=8"
            rel="noopener noreferrer"
            target="_blank"
          >
            goods and services.
          </a>
        </p>
        <p>
          That is to say, if you're at Harvard or certain other colleges, and
          are eligibly matched with someone, Datamatch, through a partnership
          with local restaurants, will provide a free meal for you to meet. All
          you have to do is toggle the meal button and hope they toggle it, too!
        </p>
        <p>
          At other schools, we have a partnership with <b>Snackpass</b> this
          year, so if your school has Snackpass, you can get some free food
          through that! Otherwise, we have some virtual date options that we've
          paid for on your behalf. So, no matter where you are, you'll be able
          to get a free date! (Supplies are limited, match them fast!)
        </p>
        <p>
          Warning: that button is one-way only, so only click if you're certain!
          Once both people in a match have toggled, an email will be sent out
          with further instructions that will guide you on claiming your free
          date. You'll have to wait or convince the other person if they haven't
          toggled yet.
        </p>
        <h4>I have the attention span of a Yale student.</h4>
        <p>tl;dr: Take survey; free food.</p>
        <h4>
          I'm in a relationship, but I'd really love to participate. Is there a
          way to tell people I'm not romantically available?
        </h4>
        <p>
          Yes! We have a "platonic" option that you can specify, meaning you
          just want to meet new friends. You'll only be matched with other
          platonic users, or users who specify that they don't care, with
          matches in the latter case being explicitly labeled platonic.
        </p>
        <h4>What else can I do on Datamatch?</h4>
        <p>
          Well, because we wanted to ~ spice things up ~ this year, we
          introduced some new fun features!
        </p>
        <ul>
          <li>
            Crush Roulette: Ever had two friends that you really want to set up?
            Or do you still have a crush on that random junior you saw in the
            dining hall one time? Just use Crush Roulette! Give us the emails of
            two people you’d like to see together before results come out on
            Valentine’s Day, and they’ll have a slightly higher chance of being
            matched by the Algorithm&trade; ;)
          </li>
          <li>
            Search Match: Now you can use our *improved* search for other users
            after results are released! That means you can invite your crush
            onto Datamatch (don’t worry, we won’t tell them who it was) and
            Crush Roulette or Search Match them. What is Search Match? See the
            next question.
          </li>
          <li>
            Match Preferences and Blocklist: Now you have slightly more control
            over who you get matched to! You can now tell us how seriously
            you’re taking Datamatch (go to “Matches” before results are
            released) and also provide emails of people you would prefer not to
            be matched with (go to “Settings”).
          </li>
        </ul>
        <h4>What is Search Matching?</h4>
        <p>
          Really want to shoot your shot? Or just want to hit up one of your
          friends on Datamatch? After matches are released on 2/14, search their
          name in the top search bar, and click “Match” in the search results!
          Note, the other user will only know that you Search Matched them if
          they also search for your name and match with you too. So, if they
          don’t feel the same way, they will never know...
        </p>
      </div>
    ),
    'The Survey': (
      <div>
        <h4>Who wrote these questions? They're so funny!</h4>
        <p>We stole them from fortune cookies.</p>
        <h4>Who wrote these questions? They're so boring!</h4>
        <p>We stole those from fortune cookies too.</p>
        <h4>
          I want to read this year's questions without taking part in the
          survey. Is that possible?
        </h4>
        <p>No.</p>
        <h4>
          Pleeeeeeassseeeeee? My mom won't let me sign up, or else I'm
          grounded...
        </h4>
        <p>
          Well, if, for what we can only assume is some apocalypse-related
          reason, you can't complete your signup, there's no penalty for logging
          in but only reading the questions. However, once you've finished
          scrolling to the bottom, the button to submit is right there
          anyway...do you really want to miss out on a defining experience of
          your college career? True love only comes along every so often...
        </p>
      </div>
    ),
    'The Algorithm™ / Results': (
      <div>
        <h4>Let's just get straight to it. Is the Algorithm&trade; random?</h4>
        <p>It can be anything you want it to be.</p>
        <h4>
          Okay, I get it. It's "proprietary artificial intelligence." *wink
          wink*
        </h4>
        <p>
          No, really! Though in the past less scrupulous Datamatch members have
          resorted to rolling 20-sided dice and examining the entrails of
          slaughtered animals, the modern Datamatch is fundamentally rooted in
          strong data analysis.
        </p>
        <h4>Right...</h4>
        <p>
          Well, it's still up to you whether to believe us or not. If you would
          like to know more, we're always looking for new members to help with
          programming and data analysis. Just shoot us an email!
        </p>
        <h4>So how accurate are these results?</h4>
        <p>
          Extremely. But though we can play Cupid, we can't play God! It's up to
          you to contact your matches, and actually make something happen. ""You
          miss 100% of the shots you don't take." - Wayne Gretzky" - Michael
          Scott.
        </p>
        <h4>What’s up with all the shape thingies on the stats page?</h4>
        <p>
          We’ve used current and historical data to build nifty interactive data
          visualizations so we can see patterns in our data and keep track of
          trends, yadda yadda—basically, we want you to spend more time on our
          website so we’ve made some cool graphs to entertain you. Go ahead and
          check it out! This year, we've looked at sign ups, matches between
          dorms and schools, matches between hometowns, the way users answer
          questions, and much much more!
        </p>
        <h4>
          I'm a senior, will I get matched with any of those stinkin'
          underclassmen?
        </h4>
        <p>
          We take into account your class year through the Algorithm&trade;, so
          generally you'll be matched with someone in or around your year. This
          includes grad students and alumni, who are also solely matched with
          each other (in most cases). We understand: we don't like those icky
          freshmen either. Even the person who's writing this FAQ, who is a
          freshman.
        </p>
        <h4>I don't like my results. What can I do about it?</h4>
        <p>
          What can you do about it? What can any of us do about it? Maybe don't
          let the existential dread get you today; go out there and meet someone
          new!
        </p>
        <h4>
          We went out for free food and had a great time and now we're best
          friends! We love you, Datamatch!
        </h4>
        <p>We love you, too. :) </p>
        <p>
          <a href="mailto:cupids@datamatch.me">Share</a> your success stories,
          we feed off of them!
        </p>
      </div>
    ),
    'General Help': (
      <div>
        <h4>AHH! AHH! AHHHHHH! SOMETHING BROKE! AHHHHHHH!</h4>
        <p>
          Okay, first: calm down. Next: let's work together to{' '}
          <a
            href="https://youtu.be/LinpRhB4aWU?t=19"
            rel="noopener noreferrer"
            target="_blank"
          >
            diagnose the problem
          </a>
          . Have you tried refreshing the page a couple times? What about
          logging out and logging back in? Incognito mode is nice too. *wink* If
          all else fails, email us and we'll be happy to help on a case by case
          basis.
        </p>
        <h4>
          I am queer, trans, or some other non-binary gender, or as a sexuality
          not listed. How can I represent this in my profile?
        </h4>
        <p>
          We try to be as inclusive as possible of all genders and sexualities
          as possible, and have added features to reflect this inclusivity, like
          allowing users to self-describe their gender identity and pronouns. We
          listened to feedback from the community to draft a{' '}
          <Link to={this.props.landing ? '/gender' : '/app/gender'}>
            matching policy
          </Link>{' '}
          that is inclusive of all gender identities. Nevertheless, if you do
          have any comments or suggestions, we encourage all/any feedback toward
          the current policy. Please contact us at
          <a href="mailto:cupids@datamatch.me"> cupids@datamatch.me</a> and we
          will get back to you!
        </p>
        <h4>
          So I’d totally take Datamatch, but I really don’t want to be matched
          with my ex...
        </h4>
        <p>
          Oof, yeah, been there… You can go to the “Settings” page and for our
          "Blocklist", submit up to 10 emails for people that you don’t want to
          be matched with!
        </p>
        <h4>Why do you have sponsors?</h4>
        <p>
          We pay for all the free date options we offer, which costs us a lot of
          money! We're just a group of college students doing this out of
          goodwill, so we rely on sponsors, including universities and private
          companies, to support us. We <b>never</b> share user data with our
          sponsors other than broad aggregates (we had X many users, we were at
          Y different schools).
        </p>
        <h4>
          I'm having an issue with submitting my information or survey answers,
          as well as load times.
        </h4>
        <p>
          When Datamatch initially opens, we're often flooded by log-ins. Try
          signing back in at a later time, when the load is lower.
        </p>
        <h4>
          I made an account and I signed up, but now I want to delete it. How
          can I do this?
        </h4>
        <p>
          Good news, kinda! You can now delete your account through your
          "Settings" page. Just know that every time an account is deleted, the
          algorithm sheds a single solitary tear at your absence, as if a
          miracle was interrupted.
        </p>
        <h4>
          My browser is giving me ugly formatting, and I'm having trouble
          logging in. What gives?
        </h4>
        <p>
          Some old versions of browsers, especially Safari and Internet
          Explorer, are known to have issues with the Datamatch website. Try
          switching to Chrome or Firefox or updating your browser version and
          seeing if that resolves the issue; if not, contact us.
        </p>
        <h4>I'm having issues on my phone.</h4>
        <p>Sounds like a personal problem. Maybe try using a real computer.</p>
        <h4>I have an idea to make Datamatch better!</h4>{' '}
        <p>
          Oooooh! Love to hear it!{' '}
          <a href="mailto:cupids@datamatch.me">Tell us about it!</a>
        </p>
        <h4>
          Everyone in Datamatch is so cool and smart and wonderful! How can I
          join Datamatch?
        </h4>{' '}
        <p>
          Why, thank you! We think you’re cool and smart and wonderful too.
          Email us at{' '}
          <a href="mailto:cupids@datamatch.me">cupids@datamatch.me</a>, we want
          to meet you!
        </p>
      </div>
    ),
  };

  componentDidMount() {
    // Prevent FAQ page event logging if embedded in the landing page
    if (!this.props.landing) {
      // Web analytics
      Mixpanel.track('FAQ_Page', {});
    }
  }

  render() {
    return (
      <Container>
        <div className="page-faq" sx={pageFAQSx}>
          <Header>FAQs</Header>
          <div className="faq-container">
            {Object.keys(this.content).map(key => {
              return (
                <div key={key}>
                  <div
                    className={
                      this.state[key] ? 'faq-button -selected' : 'faq-button'
                    }
                    // if a section gets clicked, it expands itself. you have to click again to collapse it
                    onClick={() =>
                      this.setState({
                        [key]: this.state[key] ? null : key,
                      })
                    }
                  >
                    <i
                      className={
                        this.state[key]
                          ? 'fas fa-chevron-down'
                          : 'fas fa-chevron-right'
                      }
                    ></i>
                    {key}
                  </div>
                  {this.state[key] && (
                    <div className="faq-section">{this.content[key]}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    );
  }
}
