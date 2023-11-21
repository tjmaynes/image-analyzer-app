import React from 'react'

export const ErrorContainer = ({ errors }: { errors: string[] }) => (
  <div className="error-container">
    {errors.length === 1 && <p>Failed: {errors[0]} </p>}
    {errors.length > 0 && (
      <div>
        <h3>Failed for the following reasons:</h3>
        <ul>
          {errors.map((errorMessage, index) => (
            <li key={index}>{errorMessage}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)
