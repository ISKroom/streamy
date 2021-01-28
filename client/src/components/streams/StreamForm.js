import React from 'react';
import { Field, reduxForm } from 'redux-form';

class StreamForm extends React.Component {

  // touchedは <Field/> に一度触れると true になる値
  // 一度フォームを触るかつエラーメッセージがあるときのみを表示
  renderError({ error, touched }) {
    if(touched && error){
      return(
        <div className='ui error message'>
          <div className='header'>{error}</div>
        </div>
      );
    }
  }

  // renderInputの引数は<Field/>が自動で提供してくれているもの + <Field/>でパラメータとして設定したもの が渡されている
  // <input/>が<Field/>のコンポーネントとして機能するためには<Field/>から受け取った各メソッドや値を<input/>に渡さなければならない({...input} のように)(inputにvalueやonChangeなどの値やメソッドが含まれている)
  // ちなみにrenderInput内でthisがundefinedになるのを避けるためにアロー関数を使用している
  // 開発時に邪魔なのでオートコンプリートをオフにしています
  renderInput = ({ input, label, meta }) => {
    const className = `field ${meta.error && meta.touched ? 'error': ''}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} autoComplete='off'/>
        {this.renderError(meta)}
      </div>
    );
  }

  onSubmit = (formValues) => {
    this.props.onSubmit(formValues);
  }

  render(){
    // <Field/>は<form>で囲む！
    return (
      <form　
        className='ui form error'
        onSubmit={this.props.handleSubmit(this.onSubmit)} // handleSubmitはredux-formが提供
      >
        <Field
          name='title'
          component={this.renderInput}
          type='text'
          label='Enter Title'
        />
        <Field
          name='description'
          component={this.renderInput}
          type='text'
          label='Enter Description'
        />
        <button className='ui button primary'>Submit</button>
      </form>
    );
  }
};


// errorsのプロパティ名は<Field/>の nameプロパティと同じで値である必要あり
// 同じ値であることを redux-form が自動で検知して、上でいうところの renderInput の引数として errors が渡される
// name='title'の<Field/>の場合、errors.titleが渡される（引数にはmeta.errorとして渡される）
const validate = formValues => {
  const errors = {};
  if(!formValues.title){ errors.title = 'You must enter a title';}
  if(!formValues.description){ errors.description = 'You must enter a description';}
  return errors;
}

// react-redux の connect と同様に reduxForm でコンポーネントを redux-form と wire up する
// この場合、validate は 最初のレンダリング、state(Reduxでいうところのstore)の更新、ユーザーが<Field/>とinteractする度に実行される（handleSubmit実行の度にも実行される）
export default reduxForm({
  form: 'streamForm',  // keyはformで固定（この名前じゃないとエラー）。valueは任意。Reduxのstoreとしてform.streamCreateが生成される。
  validate               // redux-formが使用できるようにvalidate関数を wire up!
})(StreamForm);

// react-redux と reduxForm を同時に使用する場合は以下のように reduxForm を connect で wrap する
// export default connect(null,{actionCreateor})(formWrapped);
