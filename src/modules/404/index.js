import React from 'react';

import './style.css';

const PageNotFound = () => {
  return (
    <div className="page_not_found">
      <div className="error">
        <div className="wrap">
          <div className="404">
            <pre><code>
	            <span className="green">&lt;!</span><span>DOCTYPE html</span><span className="green">&gt;</span>
              <br/>
              <span className="orange margin-10">&lt;html&gt;</span>
              <br/>
              <span className="orange margin-20">&lt;style&gt;</span>
              <br/>
              <div className="margin-30">
                {'* {'}
                  <br/>
                    <span className="green margin-20">everything</span>:<span className="blue">awesome</span>;
                  <br/>
                {'}'}
              </div>
              <br/>
              <span className="orange margin-20">&lt;/style&gt;</span>
              <br/>
              <span className="orange margin-20">&lt;body&gt;</span>
              <br/>
              {`      ERROR 404!
              FILE NOT FOUND!`}
              <br/>
              <div className="margin-30">
                <span className="comment margin-30">&lt;!--The file you are looking for,</span>
                <br/>
                <span className="comment margin-30">is not where you think it is.--&gt;</span>
              </div>
            <br />
            <span className="orange margin-20">&nbsp;&lt;/body&gt;</span>
            <br/>
            <span className="orange margin-10">&lt;/html&gt;</span>
            </code></pre>
            <span className="info" />
          </div>
        </div>
      </div>
    </div>
  )
};

export default PageNotFound;
