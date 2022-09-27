import Table from "react-bootstrap/Table";
import styled from "styled-components";
import { useAuthContext } from "../../hooks/useAuthContext";
import { taskFetchPath } from "../../api/fetchpaths";
import { useState, useEffect } from "react";
import { formatDistanceToNow, format } from "date-fns";
import {GrCheckbox} from "react-icons/gr"
import {GrCheckboxSelected} from "react-icons/gr"

const Container = styled.div`
  height: 80vh;
  overflow-y: auto;
`;


const Tbody = styled.tbody``;

const Tr = styled.tr``;

const Td = styled.td`
  height: 60px;
  vertical-align: middle;

  &:first-child {
    width: 10%;
  }
  &:nth-child(2) {
    width: 10%;
  }
  &:nth-child(3) {
    width: 15%;
  }
  &:nth-child(4) {
    width: 20%;
  }
  &:nth-child(5) {
    width: 40%;
  }
  &:last-child {
    width: 5%;
  }
`;

const TaskWrapper = styled.div`
  height: 40vh;
  overflow-y: auto;
  padding: 20px 50px;
  margin: 0px 10%;
  border: 1px solid black;
  border-radius: 10px;
`;

const TaskWrapperTwo = styled.div`
  height: 40vh;
  overflow-y: auto;
  padding: 20px 50px;
  margin: 0px 10%;
  border: 1px solid black;
  border-radius: 10px;
`;

const Heading = styled.h3`
  font-weight: 600;
  margin: 15px 13%;
  color: #88bb44;
`;


const UserTasksTable = () => {
    const { user } = useAuthContext();

    const [ completedTasks, setCompletedTasks ] = useState([])
    const [ unCompletedTasks, setUnCompletedTasks ] = useState([])
    const [taskID, setTaskID] = useState("")

     // START OF LOGIC FOR Mark as Complete or NOT complete //

  useEffect(() => {
    const handleChange = async () => {
    console.log(taskID)
    const response = await fetch(`${taskFetchPath}${taskID}`, {
      method: "Get",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      console.log(json.error);
    }
    console.log(`get ${json.isComplete}`);

    if (json.isComplete === "NO") {
      console.log("NO was not Completed  change to completed");

      const isComplete = "YES";
      const change = { isComplete };
      console.log(change);

      ////////////////////////// NOT Patch completed change
      const res = await fetch(taskFetchPath + taskID, {
        method: "PUT",
        body: JSON.stringify(change),
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const results = await res.json();
      console.log(results);

      if (!response.ok) {
        console.log(json.error);
      }
      if (response.ok) {
        console.log("change made");
        window.location.reload(false);
      }
    }
    if (json.isComplete === "YES") {
      console.log("YES is completed change to NOT");

      const isComplete = "NO";
      const change = { isComplete };
      console.log(change);

      ///////////////////////////////////// IS Patch paid change
      const res = await fetch(taskFetchPath + taskID, {
        method: "PUT",
        body: JSON.stringify(change),
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const results = await res.json();
      console.log(results);

      if (!response.ok) {
        console.log(json.error);
      }
      if (response.ok) {
        console.log("change made");
        window.location.reload(false);
      }
    }
  };
  handleChange();
  }, [taskID])
  
// END of COMPLETE TOGGLE LOGIC ??

  // page load fetch all tasks to display
    useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch(
        `${taskFetchPath}user/${user._id}`,
        {
          method: "GET",
          mode: "cors",
        }
      );
      
      let data = await res.json();

      setCompletedTasks([])
      setUnCompletedTasks([])

      let completed = []
      let unCompleted = []

      for (const task of data) {
        if (task.isComplete === "YES") {
            completed.push(task)
            setCompletedTasks(completed)
        } else {
            unCompleted.push(task)
            setUnCompletedTasks(unCompleted)
        }
      }
    };

    fetchTasks();
  }, [user]);


  const displayTable = (rowData) => {
    return (
        <Table striped responsive>
        <thead>
          <tr>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Created</th>
            <th>Task name</th>
            <th>Notes</th>
            <th>Complete Status</th>
          </tr>
        </thead>
        <Tbody>
          {rowData.map((row) => {
            const date = new Date(row.due_date);
            const dueDateFormatted = format(date, "MM/dd/yyyy")
            return (
              <Tr key={row._id}>
                <Td>{dueDateFormatted}</Td>
                <Td>{row.priority}</Td>
                <Td>{formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })}</Td>
                <Td>{row.taskName}</Td>
                <Td>{row.notes}</Td>
                {row.isComplete === "NO" &&
                    <Td onClick={() => {
                      setTaskID(row._id);
                    }} ><GrCheckbox /></Td>
                  }
                {row.isComplete === "YES" &&
                    <Td onClick={() => {
                      setTaskID(row._id);
                    }} ><GrCheckboxSelected /></Td>
                  }
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    )
  }

  return (
    <Container>
          <Heading>Needs to be completed</Heading>
        <TaskWrapper>
          {displayTable(unCompletedTasks)}
        </TaskWrapper>
          <Heading>Completed</Heading>
        <TaskWrapperTwo>
          {displayTable(completedTasks)}
        </TaskWrapperTwo>
    </Container>
  );
};

export default UserTasksTable;