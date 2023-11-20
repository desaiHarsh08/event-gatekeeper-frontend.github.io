import React, { useState } from 'react'
import Swal from 'sweetalert2';
import Loading from './Loading';

const Home = () => {

  const host = process.env.REACT_APP_BACKEND_URL

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState({
    rollNo: '',
    year: (new Date()).getFullYear(),
    semester: 1,
  });

  const [display, setDisplay] = useState(false);

  const [studentObj, setStudentObj] = useState({
    _id: '',
    name: '',
    year: (new Date()).getFullYear(),
    rollNo: '',
    registrationNo: '',
    stream: '',
    course: '',
    semester: 1,
    present: false,
    _v: '',
  });


  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearch((prev) => ({ ...prev, [name]: value }));

  }

  const handleClick = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Mark the student (i.e., roll_no) as present',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'Cancel',
    });

    // Check if the user clicked "Yes"
    if (result.isConfirmed) {
      // Handle the confirmation, for example, submit the form
      // console.log('User confirmed. Form submitted.');
      studentObj.present = true;
      setLoading(true);
      const res = await fetch(`${host}/api/student/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentObj)
      });
      const data = await res.json();
      setLoading(false);
      console.log(data);
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(search);
    if (search.rollNo === '' || search.semester === '' || search.year === '') {
      // Use SweetAlert to show an alert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields!',
      });
      return;
    }

    setLoading(true);
    const res = await fetch(`${host}/api/student/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rollNo: search.rollNo,
        year: search.year,
        semester: search.semester,
      })
    });
    if(res.ok) { 
      setDisplay(true);
    }
    const data = await res.json();
    setLoading(false);
    setStudentObj(data);
    console.log(data);
  }

  return (
    <>
    {loading===true? <Loading />: ''}
    
    <div className='bg-slate-100 h-[94.5vh] sm:h-screen flex justify-center items-center '>
      <div className="w-3/4 h-[70vh]  bg-white text-black pt-20 sm:pt-30 ">
        <div>
        <h1 className='px-10 sm:px-0 sm:text-xl font-medium text-justify sm:text-center uppercase'>Provide the following fields to check for the student's participation</h1>
        </div>

        {/* Form to search for the student */}
        <form className='flex flex-col gap-3 px-9 my-9 w-full ' onSubmit={handleSearch}>
          <div id='fields' className='flex flex-col sm:flex-row gap-3 w-full'>
            <div className="year flex flex-col gap-2 justify-center w-full sm:w-1/3">
              <label htmlFor="year">Year</label>
              <input type="number" name='year' id='year' value={search.year} onChange={handleChange} className='border px-4 py-2 border-slate-400 rounded-md' placeholder='Type year here' />
            </div>
            <div className="rollNo flex flex-col gap-2 justify-center w-full sm:w-1/3">
              <label htmlFor="rollNo">Roll No.</label>
              <input type="text" name='rollNo' id='rollNo' value={search.rollNo} onChange={handleChange} className='border px-4 py-2 border-slate-400 rounded-md' placeholder='Type roll_no here' />
            </div>
            <div className="semester flex flex-col gap-2 justify-center w-full sm:w-1/3">
              <label htmlFor="semester">Semester</label>
              <input type="number" name='semester' id='semester' value={search.semester} onChange={handleChange} className='border px-4 py-2 border-slate-400 rounded-md' placeholder='Type semester here' />
            </div>
          </div>
          <div className="btns">
            <button className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md'>Search</button>
          </div>
        </form>

        {/* Display the student details */}
        {display===true? <div id="details" className='w-full px-2 overflow-x-auto'>
          <table className='min-w-[1136px] '>
            <thead className='border-2 border-black w-full'>
              <tr className='flex font-medium bg-slate-200'>
                <td className='w-[14.2857%] border-r-2 border-black py-2 text-center'>Roll No.</td>
                <td className='w-[14.2857%] border-r-2 border-black py-2 text-center'>Name</td>
                <td className='w-[14.2857%] border-r-2 border-black py-2 text-center'>Stream</td>
                <td className='w-[14.2857%] border-r-2 border-black py-2 text-center'>Course</td>
                <td className='w-[14.2857%] border-r-2 border-black py-2 text-center'>Year</td>
                <td className='w-[14.2857%] border-r-2 border-black py-2 text-center'>Semester</td>
                <td className='w-[14.2857%]  py-2 text-center'>Registration No.</td>
              </tr>
            </thead>
            <tbody className={`'border-2 border-black w-full ${studentObj.present?'text-green-500':'text-red-500'} font-medium'`}>
              <tr className='flex w-full hover:bg-slate-50 cursor-pointer border-2 border-black border-t-transparent' onClick={handleClick}>
                <td className='w-[14.2857%] border-r-2 border-black py-2 flex justify-center items-center'>
                  {studentObj.rollNo}
                </td>
                <td className='w-[14.2857%] border-r-2 border-black py-2 flex justify-center items-center'>
                  {studentObj.name}
                </td>
                <td className='w-[14.2857%] border-r-2 border-black py-2 flex justify-center items-center'>
                  {studentObj.stream}
                </td>
                <td className='w-[14.2857%] border-r-2 border-black py-2 flex justify-center items-center'>
                  {studentObj.course}
                </td>
                <td className='w-[14.2857%] border-r-2 border-black py-2 flex justify-center items-center'>
                  {studentObj.year}
                </td>
                <td className='w-[14.2857%] border-r-2 border-black py-2 flex justify-center items-center'>
                  {studentObj.semester}
                </td>
                <td className='w-[14.2857%]  py-2 flex justify-center items-center'>
                  {studentObj.registrationNo}
                </td>
              </tr>
            </tbody>
          </table>
        </div>: ''}

      </div>
    </div>
    </>
  )
}

export default Home
