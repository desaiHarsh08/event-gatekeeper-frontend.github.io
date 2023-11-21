import React, { useState } from 'react'
import * as XLSX from 'xlsx';
// import Swal from 'sweetalert2';
import Loading from './Loading';
// import * as XLSX from 'xlsx';

const Settings = () => {


  const host = process.env.REACT_APP_BACKEND_URL;

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);



  const [excelData, setExcelData] = useState([]);

  // eslint-disable-next-line
  const [rfid, setRfid] = useState('');
  // eslint-disable-next-line
  const [display, setDisplay] = useState(false);

  const [studentObj, setStudentObj] = useState({
    _id: '',
    name: '',
    rfid: '',
    event: '',
    status: false,
    _v: '',
  });

  // eslint-disable-next-line
  const handleChange = (event) => {
    setRfid(event.target.value);

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

  // const handleSearch = async (e) => {
  //   e.preventDefault();
  //   // console.log(search);
  //   if (rfid === '') {
  //     // Use SweetAlert to show an alert
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Oops...',
  //       text: 'Please enter the valid RFID!',
  //     });
  //     return;
  //   }
  //   setLoading(true);
  //   const res = await fetch(`${host}/api/student/search`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ rfid })
  //   });
  //   if (res.ok) {
  //     const data = await res.json();
  //     setLoading(false);
  //     setDisplay(true);
  //     setStudentObj(data);
  //     console.log(data);
  //   }
  //   else {
  //     setDisplay(false);
  //   }
  // }

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
          rfid: excelData[i].year,
          event: excelData[i].event,
          status: true
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

  const downloadExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `data.xlsx`);
  };

  const handleFetch = async () => {
    const res = await fetch(`${host}/api/student/fetch-all`, {
      method: 'GET'
    });
    if (!res.ok) {
      alert('Internal Server Error!');
      return;
    }

    const data = await res.json();
    setLoading(false);
    if (data.length !== 0) {
      const arr = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].attendance === true) {
          data[i].attendance = 'Y';
        }
        else {
          data[i].attendance = 'N';
        }
        arr.push({
          rfid: data[i].rfid,
          name: data[i].name,
          event: data[i].event,
          attendance: data[i].attendance,
        });
      }
      downloadExcel(arr);
    }
  }

  // eslint-disable-next-line
  const handleStudentChange = (event) => {
    const { name, value } = event.target;
    setStudentObj((prev) => ({ ...prev, [name]: value }));
    console.log(studentObj)
  }

  // const handleUpdate = async () => {
  //   setLoading(true);

  //   const res = await fetch(`${host}/api/student/update`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(studentObj)
  //   });
  //   if (!res.ok) {
  //     alert('Internal Server Error!');
  //     return;
  //   }

  //   const data = await res.json();
  //   setLoading(false);
  //   if (data) {
  //     alert(`Data updated for Roll No.: ${studentObj.rollNo}`);
  //   }
  // }

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
      <div className=' h-[85vh] overflow-y-auto'>
        <div className="w-full sm:h-[85vh] bg-white text-black py-10 flex justify-center items-center  ">
          <div className=''>
            {/* Add the data */}
            <div className="px-3">
              <p className='text-xl font-medium  '>Upload the data using excel file.</p>
              <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileInput} className='my-2' />
              <button disabled={excelData.length === 0} className='px-4 py-2 my-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md' onClick={handleUpload}>Upload</button>
            </div>

            {/* Delete all the data */}
            <div className="px-3 my-20">
              <p className='text-xl font-medium  '>Reset the database</p>
              <button onClick={handleReset} className='px-4 py-2 my-2 bg-red-500 hover:bg-red-600 text-white rounded-md'>Reset</button>
            </div>

            {/* Fetch all the students */}
            <div className="px-3 my-20">
              <p className='text-xl font-medium  '>Fetch all the data</p>
              <button onClick={handleFetch} className='px-4 py-2 my-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md'>Fetch</button>
            </div>

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
