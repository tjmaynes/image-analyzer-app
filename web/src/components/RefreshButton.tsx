import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const RefreshButton = () => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => {
        navigate(0)
      }}
    >
      Refresh
    </button>
  )
}
