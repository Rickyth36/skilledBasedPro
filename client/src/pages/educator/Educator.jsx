import React from 'react'
import { Outlet } from 'react-router-dom'

function Educator() {
  return (
    <div>
        <p>Educator</p>
        <div className="">
            {<Outlet/>}
        </div>

    </div>
  )
}

export default Educator