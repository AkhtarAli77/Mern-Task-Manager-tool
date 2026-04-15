import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdGridView } from "react-icons/md";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Loading, Table, Tabs, Title } from "../components";
import { AddTask, BoardView, TaskTitle } from "../components/tasks";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import { TASK_TYPE } from "../utils";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const Tasks = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || "");

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  const status = params?.status || "";

  const { data, isLoading, refetch, error } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: searchTerm,
  });

  // ✅ Excel Download Function - Working
  const downloadExcel = () => {
    console.log("=== DOWNLOAD EXCEL STARTED ===");
    console.log("Data from API:", data);
    
    // ✅ data already array hai, .tasks nahi chahiye
    const tasks = data || [];
    
    console.log("Tasks count:", tasks.length);
    
    if (tasks.length === 0) {
      toast.error("No tasks to download. Please create a task first!");
      return;
    }

    try {
      // Convert tasks to Excel format
      const excelData = tasks.map(task => ({
        "Task Title": task.title || "",
        "Description": task.description || "",
        "Priority": task.priority || "",
        "Stage": task.stage || "",
        "Created At": task.date ? new Date(task.date).toLocaleDateString() : "No date",
        "Team": task.team?.map(t => t.name).join(", ") || "No Team"
      }));

      console.log("Excel data prepared:", excelData.length, "rows");

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Tasks");
      XLSX.writeFile(wb, `tasks_${new Date().toISOString().slice(0,19)}.xlsx`);
      
      console.log("Excel file created successfully!");
      toast.success(`✅ ${tasks.length} tasks exported successfully!`);
    } catch (err) {
      console.error("Excel download error:", err);
      toast.error("Failed to download Excel: " + err.message);
    }
  };

  useEffect(() => {
    console.log("Tasks API Response:", data);
    console.log("Is array:", Array.isArray(data));
    console.log("Length:", data?.length);
    if (error) {
      console.log("Tasks API Error:", error);
    }
  }, [data, error]);

  useEffect(() => {
    refetch();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [open, refetch]);

  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  // ✅ tasks = data (array directly from API)
  const tasks = data || [];

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        <div className='flex gap-2'>
          {/* ✅ Excel Download Button */}
          <Button
            label='Download Excel'
            onClick={downloadExcel}
            className='bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700'
          />
          
          {/* Create Task Button */}
          {!status && (
            <Button
              label='Create Task'
              icon={<IoMdAdd className='text-lg' />}
              className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
              onClick={() => setOpen(true)}
            />
          )}
        </div>
      </div>

      <div>
        <Tabs tabs={TABS} setSelected={setSelected}>
          {!status && (
            <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
              <TaskTitle label='To Do' className={TASK_TYPE.todo} />
              <TaskTitle
                label='In Progress'
                className={TASK_TYPE["in progress"]}
              />
              <TaskTitle label='Completed' className={TASK_TYPE.completed} />
            </div>
          )}

          {selected === 0 ? (
            <BoardView tasks={tasks} />
          ) : (
            <Table tasks={tasks} />
          )}
        </Tabs>
      </div>
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;

