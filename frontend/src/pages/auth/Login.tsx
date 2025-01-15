
import { useDeviceDetails } from '@/hooks/useDevice'
import React, { useEffect } from 'react'

export const Login: React.FC = () => {
  const device = useDeviceDetails();

  useEffect(() => {
    console.log(device)
  }, [device])
  return (
    <div>Login</div>
  )
}
