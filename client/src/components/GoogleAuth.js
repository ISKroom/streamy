import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut } from '../actions';

class GoogleAuth extends React.Component {

  // コンポーネントが最初にレンダリングされたときだけ実行
  componentDidMount() {
    // gapi.loadでメソッドをロードしている（gapiはindex.htmlでロードしている）
    window.gapi.load('client:auth2', () => {
      window.gapi.client
        .init({
          clientId:
            '490333756337-1319rdroqqgnalc91q8o9c1jj4tffdcv.apps.googleusercontent.com',
          scope: 'email'
        })
        .then(() => {
          // 実際のサインイン/アウト状態を取得
          this.auth = window.gapi.auth2.getAuthInstance();
          // Reduxのstoreにその状態を反映
          this.onAuthChange(this.auth.isSignedIn.get());

          // .listen は GoogleAuth.isSignedIn に固有のメソッド
          // ユーザーのサインイン/アウトを検知して自動でcallback関数を実行する
          this.auth.isSignedIn.listen(this.onAuthChange);
        });
    });
  }

  // callback関数として使うのでアロー関数を使用
  // 実際のサインイン/アウトに連動してReduxのstoreを更新する
  onAuthChange = (isSignedIn) => {
    if(isSignedIn){
      this.props.signIn(this.auth.currentUser.get().getId()); // 引数はgapiが提供するユーザーID
    } else {
      this.props.signOut();
    }
  }

  // 実際のサインイン処理
  onSignInClick = () => {
    this.auth.signIn();
  };

  // 実際のサインアウト処理
  onSignOutClick = () => {
    this.auth.signOut();
  };

  renderAuthButton() {
    if (this.props.isSignedIn === null) {
      return null;
    } else if (this.props.isSignedIn) {
      return (
        <button
          className='ui red google button'
          onClick={this.onSignOutClick}
        >
          <i className='google icon' />
          Sign Out
        </button>
      );
    } else {
      return (
        <button
          className='ui blue google button'
          onClick={this.onSignInClick}
        >
          <i className='google icon' />
          Sign In with Google
        </button>
      );
    }
  }

  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

// 引数の state は Redux の store を指す
const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn
  }
}

export default connect(
  mapStateToProps,
  { signIn, signOut }
)(GoogleAuth);
