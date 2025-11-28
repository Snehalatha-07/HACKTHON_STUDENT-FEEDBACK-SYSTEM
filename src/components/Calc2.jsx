import React, { useState } from 'react';

const Calc2 = () => {
  const [value, setValue] = useState('');

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ backgroundColor: 'aqua' }}>Basic Calc Application</h1>

      <form>
        <fieldset
          style={{
            display: 'inline-block',
            padding: '20px',
            border: '2px solid black',
            borderRadius: '8px',
            marginTop: '20px',
            background: '#f9f9f9',
          }}
        >
          <legend style={{ fontWeight: 'bold', fontSize: '18px' }}>
            Calculator
          </legend>

          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              value={value}
              readOnly
              style={{
                width: '220px',
                height: '35px',
                fontSize: '18px',
                textAlign: 'right',
              }}
            />
          </div>

          <div>
            <input type="button" value="AC" onClick={() => setValue('')} /> &nbsp;
            <input
              type="button"
              value="DEL"
              onClick={() => setValue(value.slice(0, -1))}
            />{' '}
            &nbsp;
            <input
              type="button"
              value="."
              onClick={(e) => setValue(value + e.target.value)}
            />
            &nbsp;&nbsp;
            <input
              type="button"
              value="/"
              onClick={(e) => setValue(value + e.target.value)}
            />
          </div>

          <div>
            <input
              type="button"
              value="7"
              onClick={(e) => setValue(value + e.target.value)}
            />{' '}
            &nbsp;
            <input
              type="button"
              value="8"
              onClick={(e) => setValue(value + e.target.value)}
            />{' '}
            &nbsp;
            <input
              type="button"
              value="9"
              onClick={(e) => setValue(value + e.target.value)}
            />
            &nbsp;
            <input
              type="button"
              value="*"
              onClick={(e) => setValue(value + e.target.value)}
            />
          </div>

          <div>
            <input
              type="button"
              value="4"
              onClick={(e) => setValue(value + e.target.value)}
            />{' '}
            &nbsp;
            <input
              type="button"
              value="5"
              onClick={(e) => setValue(value + e.target.value)}
            />{' '}
            &nbsp;
            <input
              type="button"
              value="6"
              onClick={(e) => setValue(value + e.target.value)}
            />
            &nbsp;
            <input
              type="button"
              value="+"
              onClick={(e) => setValue(value + e.target.value)}
            />
          </div>

          <div>
            <input
              type="button"
              value="1"
              onClick={(e) => setValue(value + e.target.value)}
            />{' '}
            &nbsp;
            <input
              type="button"
              value="2"
              onClick={(e) => setValue(value + e.target.value)}
            />{' '}
            &nbsp;
            <input
              type="button"
              value="3"
              onClick={(e) => setValue(value + e.target.value)}
            />
            &nbsp;
            <input
              type="button"
              value="-"
              onClick={(e) => setValue(value + e.target.value)}
            />
          </div>

          <div>
            <input
              type="button"
              value="0"
              onClick={(e) => setValue(value + e.target.value)}
            />{' '}
            &nbsp;
            <input
              type="button"
              value="00"
              onClick={(e) => setValue(value + e.target.value)}
            />{' '}
            &nbsp;
            <input
              type="button"
              value="000"
              onClick={(e) => setValue(value + e.target.value)}
            />
            &nbsp;
            <input
              type="button"
              value="="
              onClick={() => {
                try {
                  // eslint-disable-next-line no-eval
                  setValue(eval(value).toString());
                } catch {
                  setValue('Error');
                }
              }}
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Calc2;
