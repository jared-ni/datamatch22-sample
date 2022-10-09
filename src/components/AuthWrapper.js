/** @jsx jsx */

import { jsx, css } from '@emotion/core';

import Logo from 'components/Logo';

const authWrapperStyle = css`
  text-align: center;
  padding: 20px;

  a {
    color: rgba(0, 0, 0, 0.5);
    font-size: 14px;
  }

  .Box {
    background: white;
    box-shadow: 4px 4px #dedef0;
    padding: 20px 30px;
    max-width: 460px;
    align-items: left;
    justify-content: left;
    text-align: left;
    margin: 40px auto 0 auto;
    input {
      background: #f4f2f2;
      border: none;
    }
  }
`;

// component used by all the authentication pages to create the same logo + box view
const AuthWrapper = ({ children, portal }) => {
  return (
    <div className="AuthWrapper" css={authWrapperStyle}>
      <Logo center portal={portal} />
      <div className="Box">{children}</div>
    </div>
  );
};

export default AuthWrapper;
