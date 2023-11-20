import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import Loading from './Loading';


const Settings = () => {


  const host = process.env.REACT_APP_BACKEND_URL;

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);



  const [excelData, setExcelData] = useState([]);


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

  const handleFileInput = (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataFromFile = e.target.result;
        const workbook = XLSX.read(dataFromFile, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Assumes the first sheet
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        setExcelData(data);
        console.log(data)
      };
      reader.readAsArrayBuffer(file);
    }
    setLoading(false);
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
    if (res.ok) {
      const data = await res.json();
      setLoading(false);
      setDisplay(true);
      setStudentObj(data);
      console.log(data);
    }
    else {
      setDisplay(false);
    }
  }

  const handleAdd = async ({ name, year, rollNo, registrationNo, stream, course, semester, present }) => {
    console.log(name, year, rollNo, registrationNo, stream.toUpperCase(), course, semester, present)
    const res = await fetch(`${host}/api/student/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name, year: year, rollNo: rollNo, registrationNo: rollNo, stream: stream.toUpperCase(), course: course, semester: semester, present: present
      })
    });
    const data = await res.json();
    console.log(data);
    return res.ok;
  }

  const handleUpload = async () => {
    if (excelData.length === 0) {
      alert('No data got scanned!');
      return;
    }
    else {
      setLoading(true);
      const progressContainer = document.getElementById('progress');
      progressContainer.classList.toggle('hidden');
      progressContainer.classList.toggle('flex');
      for (let i = 0; i < excelData.length; i++) {
        let obj = {
          name: excelData[i].name,
          year: excelData[i].year,
          rollNo: excelData[i].rollNo,
          registrationNo: excelData[i].registrationNo,
          stream: excelData[i].stream,
          course: excelData[i].course,
          semester: excelData[i].semester,
          present: false,
        };
        console.log(obj);
        await handleAdd(obj);
        setProgress((((i + 1) * 100) / excelData.length).toFixed(2));
      }
      setLoading(false);
      progressContainer.classList.toggle('hidden');
      progressContainer.classList.toggle('flex');
    }
  }

  const handleStudentChange = (event) => {
    const { name, value } = event.target;
    setStudentObj((prev) => ({ ...prev, [name]: value }));
    console.log(studentObj)
  }

  const handleUpdate = async () => {
    setLoading(true);

    const res = await fetch(`${host}/api/student/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(studentObj)
    });
    if (!res.ok) {
      alert('Internal Server Error!');
      return;
    }

    const data = await res.json();
    setLoading(false);
    if (data) {
      alert(`Data updated for Roll No.: ${studentObj.rollNo}`);
    }
  }

  const handleReset = async () => {
    setLoading(true);
    const res = await fetch(`${host}/api/student/delete-all`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      alert('Internal Server Error!');
      return;
    }

    const data = await res.json();
    setLoading(false);
    if (data) {
      alert("Reset Successfull!");
    }
  }

  return (
    <>
      {loading === true ? <Loading /> : ''}
      <div className='bg-slate-100 mt-10 h-screen flex justify-center items-center '>
        <div className="w-3/4  sm:h-[85vh] bg-white text-black pt-10 ">
          {/* Add the data */}
          <div className="px-3">
            <p className='text-xl font-medium  '>Upload the data using excel file.</p>
            <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileInput} className='my-2' />
            <button disabled={excelData.length === 0} className='px-4 py-2 my-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md' onClick={handleUpload}>Upload</button>
          </div>

          {/* Delete all the data */}
          <div className="px-3 my-10">
            <p className='text-xl font-medium  '>Reset the database</p>
            <button onClick={handleReset} className='px-4 py-2 my-2 bg-red-500 hover:bg-red-600 text-white rounded-md'>Reset</button>
          </div>

          {/* Update a student */}
          <div className="px-3">
            <p className='text-xl font-medium '>Update the student</p>
            <form className='flex flex-col gap-3 my-9 w-full ' onSubmit={handleSearch}>
              <div id='fields' className='flex flex-col sm:flex-row gap-3 w-full'>
                <div className="year flex flex-col gap-2 justify-center w-full sm:w-1/4">
                  {/* <label htmlFor="year">Year</label> */}
                  <input type="number" name='year' id='year' value={search.year} onChange={handleChange} className='border px-4 py-2 border-slate-400 rounded-md' placeholder='Type year here' />
                </div>
                <div className="rollNo flex flex-col gap-2 justify-center w-full sm:w-1/4">
                  {/* <label htmlFor="rollNo">Roll No.</label> */}
                  <input type="text" name='rollNo' id='rollNo' value={search.rollNo} onChange={handleChange} className='border px-4 py-2 border-slate-400 rounded-md' placeholder='Type roll_no here' />
                </div>
                <div className="semester flex flex-col gap-2 justify-center w-full sm:w-1/4">
                  {/* <label htmlFor="semester">Semester</label> */}
                  <input type="number" name='semester' id='semester' value={search.semester} onChange={handleChange} className='border px-4 py-2 border-slate-400 rounded-md' placeholder='Type semester here' />
                </div>
                <div className="btns">
                  <button className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md'>Search</button>
                </div>
              </div>

            </form>
            {display === true ? <> <div id="details" className='w-full overflow-x-auto  px-2'>
              <table className='min-w-[1136px]'>
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
                <tbody className={`'border-2 border-black w-full ${studentObj.present ? 'text-green-500' : 'text-red-500'} font-medium'`}>
                  <tr className='flex w-full hover:bg-slate-50 border-2 border-black border-t-[.5px]' >
                    <td className='w-[14.2857%] border-r-2 border-black py-2 flex justify-center items-center'>
                      <input type="text" name='rollNo' value={studentObj.rollNo} onChange={handleStudentChange} className='w-full h-full bg-transparent m-1 outline-none text-center ' />

                    </td>
                    <td className='w-[14.2857%] border-r-2 border-black py-2 flex justify-center items-center'>
                      <input type="text" name='name' value={studentObj.name} onChange={handleStudentChange} className='w-full h-full bg-transparent m-1 outline-none text-center' />
                    </td>
                    <td className='w-[14.2857%] border-r-2 border-black py-2 flex justify-center items-center'>
                      <input type="text" name='stream' value={studentObj.stream} onChange={handleStudentChange} className='w-full h-full bg-transparent m-1 outline-none text-center' />
                    </td>
                    <td className='w-[14.2857%] border-r-2 border-black py-2 flex justify-center items-center'>
                      <input type="text" name='course' value={studentObj.course} onChange={handleStudentChange} className='w-full h-full bg-transparent m-1 outline-none text-center' />
                    </td>
                    <td className='w-[14.2857%] border-r-2 border-black py-2 flex justify-center items-center'>
                      <input type="text" name='year' value={studentObj.year} onChange={handleStudentChange} className='w-full h-full bg-transparent m-1 outline-none text-center' />
                    </td>
                    <td className='w-[14.2857%] border-r-2 border-black py-2 flex justify-center items-center'>
                      <input type="text" name='semester' value={studentObj.semester} onChange={handleStudentChange} className='w-full h-full bg-transparent m-1 outline-none text-center' />
                    </td>
                    <td className='w-[14.2857%]  py-2 flex justify-center items-center'>
                      <input type="text" name='registrationNo' value={studentObj.registrationNo} onChange={handleStudentChange} className='w-full h-full bg-transparent m-1 outline-none text-center' />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
              <div className='m-3'>
                <button onClick={handleUpdate} className='bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium px-4 py-2'>Save</button>
              </div>
            </> : ''}
          </div>


          {/* Progress */}
          <div id="progress" className='hidden absolute bottom-20 z-10 h-20 left-0 right-0 w-full rounded-md  justify-center items-center font-medium gap-3  '>
            <div className='bg-slate-500 w-1/5 h-full text-white rounded-md flex justify-center items-center font-medium gap-3 '>
              <span>Completed:</span>
              <span>{progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings
