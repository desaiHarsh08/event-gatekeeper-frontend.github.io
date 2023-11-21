import React, { useState } from 'react'
import Loading from './Loading'

const Home = () => {

  const host = process.env.REACT_APP_BACKEND_URL;

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rfid = document.getElementById('rfid').value;
    setData(null);
    if (rfid === '') {
      alert("Invalid RFID...!");
      return;
    }
    else {
      setLoading(true);
      const res = await fetch(`${host}/api/student/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rfid })
      });
      setLoading(false);
      if (!res.ok) {
        alert(`${rfid} - NOT ALLOWED`);
        return;
      }
      const data = await res.json();
      console.log(data)
      setData(data);
    }

  }
  return (
    <>
      {loading === true ? <Loading /> : ''}

      <div className='h-[85vh] w-full flex justify-center items-center '>
        <div className=" w-3/4 h-3/4  flex flex-col justify-center transition-all ">
          {/* Heading */}
          <h1 className='my-3 font-medium text-xl uppercase '>Enter the RFID to check for student's status</h1>
          {/* Form for search */}
          <form onSubmit={handleSubmit}>
            <div className="my-3 rfid">
              <label htmlFor="rfid"></label>
              <input type="text" name="rfid" id="rfid" className='border border-slate-500 px-4 py-2 w-full rounded-md focus-within:outline-blue-300 focus:border-blue-300 ' />
            </div>
            <div className="btn">
              <button type='submit' className='px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md '>Search</button>
            </div>
          </form>
          {/* Display the data */}
          {
            data !== null ?
              <table className='w-full my-5'>
                <thead >
                  <tr className='border-2 border-black'>
                    <td className='w-1/3 py-2 border-r-2 border-black text-center font-medium bg-slate-100'>Name</td>
                    <td className='w-1/3 py-2 border-r-2 border-black text-center font-medium bg-slate-100'>RFID</td>
                    <td className='w-1/3 py-2 border-r-2 border-black text-center font-medium bg-slate-100'>Event</td>
                    {/* <td className='w-1/3 py-2 border-r-2 border-black text-center font-medium bg-slate-100'>Status</td> */}
                  </tr>
                </thead>
                <tbody>
                  <tr className='border-2 border-black'>
                    <td className='w-1/3 py-2 border-r-2 border-black text-center'>{data?.name}</td>
                    <td className='w-1/3 py-2 border-r-2 border-black text-center'>{data?.rfid}</td>
                    <td className='w-1/3 py-2 border-r-2 border-black text-center'>{data?.event}</td>
                    {/* <td className='py-2 border-r-2 border-black text-center'>{data?.status===true? "ALLOWED": "NOT ALLOWED"}</td> */}
                  </tr>
                </tbody>
              </table>
              : ''
          }
        </div>
      </div>
    </>
  )
}

export default Home
