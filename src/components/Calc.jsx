import React, { useState } from 'react';

const Calc = () => {
  const [value, setValue] = useState(0);

  const increase = () => {
    setValue(value + 1);
  };

  const decrease = () => {
    setValue(value - 1);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '60px',
        background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <fieldset
        style={{
          padding: '30px 50px',
          border: '2px solid rgba(255,255,255,0.5)',
          borderRadius: '12px',
          textAlign: 'center',
          width: '350px',
          background: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        }}
      >
        <legend
          style={{
            fontWeight: 'bold',
            fontSize: '20px',
            padding: '0 10px',
            color: '#333',
          }}
        >
          Basic Calculator
        </legend>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={value}
            readOnly
            style={{
              width: '120px',
              height: '45px',
              fontSize: '22px',
              textAlign: 'center',
              border: '2px solid #ccc',
              borderRadius: '6px',
              background: '#f9f9f9',
            }}
          />
        </div>

        <div>
          <button
            onClick={increase}
            style={{
              width: '60px',
              height: '45px',
              margin: '8px',
              fontSize: '20px',
              background: 'lightgreen',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) =>
              (e.target.style.boxShadow =
                '0 0 20px 5px rgba(0, 255, 0, 0.6)')
            }
            onMouseOut={(e) => (e.target.style.boxShadow = 'none')}
          >
            +
          </button>

          <button
            onClick={decrease}
            style={{
              width: '60px',
              height: '45px',
              margin: '8px',
              fontSize: '20px',
              background: 'lightcoral',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) =>
              (e.target.style.boxShadow =
                '0 0 20px 5px rgba(255, 0, 0, 0.6)')
            }
            onMouseOut={(e) => (e.target.style.boxShadow = 'none')}
          >
            -
          </button>
        </div>
      </fieldset>
    </div>
  );
};

export default Calc;
