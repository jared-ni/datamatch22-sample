/** @jsx jsx */

import React, { Component } from 'react';
import { css } from '@emotion/core';
import { firebaseConnect } from 'react-redux-firebase';
import { jsx, Close } from 'theme-ui';

import Loading from 'components/Loading';

const picUploadStyle = css`
  position: relative;
  display: inline-block;
  background: #9b9b9b;

  input {
    display: none;
  }

  label {
    position: absolute;
    left: 0px;
  }

  .imagehover {
    position: absolute;
    top: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;

    &:hover {
      opacity: 0.9;
    }

    i {
      font-size: 40px;
      opacity: 0.7;
      cursor: pointer;
      color: #3b3b3b;
    }

    img {
      background: white;
    }
  }

  .profile-pic {
    object-fit: cover;
  }
`;

const loadingStyle = css`
  display: inline-block;
`;

/* this component renders our pic upload (specifically profile pic) component */
class PicUpload extends Component {
  constructor(props) {
    super(props);
    this.file = React.createRef();
    this.state = { pic: props.original_pic, loading: false };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.original_pic !== this.props.original_pic) {
      this.setState({ pic: this.props.original_pic });
    }
  }

  onChange = async e => {
    const {
      firebase: { update, uploadFile },
      missing,
      name,
      path,
      updateURL,
      updateNotifs,
    } = this.props;

    this.setState({ loading: true });

    try {
      const { uploadTaskSnapshot } = await uploadFile(
        path,
        e.target.files[0],
        null,
        { name: name + '.jpg' },
      );
      const downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();
      updateURL({ profile_pic: downloadURL });

      if (updateNotifs && missing === 'profile picture') {
        update(`/notifs/${name}/pre/`, { profile: true });
      }

      this.setState({ loading: false, pic: downloadURL });
    } catch (error) {
      console.log(error.message);
      alert(
        'Invalid image file or image file too small (10KB minimum) or too large (max 5MB limit).',
      );
      this.setState({ loading: false });
    }
  };

  removePic = () => {
    const {
      firebase,
      name,
      path,
      updateURL,
      updateNotifs,
      deleteFromStorage,
    } = this.props;

    // don't need to update firebase if profile pic doesn't exist already
    if (!this.state.pic) {
      return;
    }
    this.setState({ pic: null });
    updateURL({ profile_pic: null });
    if (deleteFromStorage) {
      firebase.deleteFile(`${path}/${name}.jpg`);
    }
    if (updateNotifs) {
      firebase.update(`/notifs/${name}/pre/`, { profile: null });
    }
  };

  renderProfilePic() {
    const { size } = this.props;
    const { pic } = this.state;
    return (
      <img
        alt="profile pic"
        className="profile-pic"
        src={pic || require('assets/empty.png').default}
        style={{ height: size, width: size }}
      />
    );
  }

  render() {
    const { size } = this.props;
    if (this.state.loading) {
      return (
        <div css={loadingStyle} style={{ height: size, width: size }}>
          <Loading type="spin" style={{ height: '100%' }} size={size / 2} />
        </div>
      );
    }

    return (
      <div
        className="PicUpload"
        css={picUploadStyle}
        style={{ height: size, width: size }}
      >
        <label>
          <input
            accept="image/*"
            ref={this.file}
            type="file"
            onChange={this.onChange}
          />

          {this.renderProfilePic()}

          <div
            className="imagehover"
            style={{
              height: size,
              width: size,
            }}
          >
            <img
              alt="upload"
              src={require('assets/picupload.png').default}
              style={{
                height: size,
                opacity: this.state.pic ? null : 0.9,
                width: size,
              }}
            />
            <Close
              title="Remove"
              onClick={this.removePic}
              sx={{
                bg: 'white',
                borderRadius: '3px',
                top: '5px',
                right: '5px',
                position: 'absolute',
                visibility: this.state.pic ? null : 'hidden',
              }}
            />
          </div>
        </label>
      </div>
    );
  }
}

export default firebaseConnect()(PicUpload);
