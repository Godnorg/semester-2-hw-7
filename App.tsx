import { useEffect, useState } from "react";
import { supabase, Database } from "./supabase";

type Student = Database['public']['Tables']['student']['Row'];
type School = Database['public']['Tables']['school']['Row']

const App = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [school, setSchool] = useState('');
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [foundedIn, setFoundedIn] = useState('');
  
  const createStudent = async () => {
    await supabase.from('student').insert({
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      school: school
    });
    await fetchStudents();
  }

  const createSchool = async () => {
    await supabase.from('school').insert({
      title: title,
      address: address,
      foundedIn: foundedIn
    });
    await fetchSchools();
  }

  const fetchStudents = async () => {
  const response = await supabase.from("student").select(`
      *
    `);
    if (response.data) {
      setStudents(response.data);
    }
  }
  const fetchSchools = async () => {
    const response = await supabase.from('school').select(`*`);
    if (response.data) {
      setSchools(response.data);
    }
  };

  const handleDeleteStudent = async (id: Student['id']) => {
    await supabase.from('student').delete().eq('id', id);
    await fetchStudents();
  }

  const handleDeleteSchool = async (id: School['id']) => {
    await supabase.from('school').delete().eq('id', id);
    await fetchSchools();
  }

  useEffect(() => {
    fetchStudents();
    fetchSchools();
  }, []);
  return (
    <div>
      <div>
        <input type="text" placeholder='first name' value={firstName} onChange={e => setFirstName(e.target.value)} />
        <input type="text" placeholder='lastname' value={lastName} onChange={e => setLastName(e.target.value)} />
        <input type="date" placeholder='dob' value={dob} onChange={e => setDob(e.target.value)} />
        <select defaultValue='' onChange={(e) => setSchool(e.target.value)} value={school}>
          <option key={0}></option>
          {schools.map((v) => <option value={v.id}>{v.title} </option>)}
        </select>
        <button onClick={createStudent}>Create Student</button>
        <br></br>
        <input type="text" placeholder='title' value={title} onChange={e => setTitle(e.target.value)} />
        <input type="text" placeholder='address' value={address} onChange={e => setAddress(e.target.value)} />
        <input type="int2" placeholder='foundedIn' value={foundedIn} onChange={e => setFoundedIn(e.target.value)} />
        <button onClick={createSchool}> Create Schools</button>
      </div>
      <div className="flex">
        <div>
          <h1>Students</h1>
          {students.map((v, i) => {
            return (
            <div key={i}>
              <p>{v.firstName} {v.lastName} {v.dob} <button onClick={() => handleDeleteStudent(v.id)}>Delete</button></p>
            </div>
            )
          })}
        </div>
        <div>
          <h1>Schools</h1>
          {schools.map((v, i) => {
            return (
              <div key={i}>
                <p>{v.title} <button onClick={() => handleDeleteSchool(v.id)}>Delete</button></p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
