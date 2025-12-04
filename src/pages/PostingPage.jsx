import React, { useEffect, useState } from "react";
import { showToast } from "../helper/toastMessage";
import messages from "../constants/message";
import { fetchPosting } from "../service/postingApi";
import PostingTable from "./PostingTable"; // Import the new PostingTable component
import PostingCreate from "./PostingCreate"; // Import the new PostingCreate component

const PostingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [visibleSection, setVisibleSection] = useState("table"); // 'table' or 'form'
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Used to pass data to PostingCreate for editing

  const [reloadDataTrigger, setReloadDataTrigger] = useState(0); // Trigger data reload for table

  const pageSize = 10;


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchPosting(currentPage, pageSize);
        setData(res.data);
        setTotalPages(Math.ceil(res.total / pageSize));
      } catch (err) {
        showToast.error(err.message || "Failed to fetch postings");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage, pageSize, reloadDataTrigger]);

  const handleCreatePosting = () => {
    setSelectedUser(null); 

  };


  const handleEditUser = (user) => {
    setSelectedUser(user); 
  };

  return (
      <div className='container mx-auto p-4'>
            <PostingTable
                data={data}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                handleEditUser={handleEditUser}
                handleCreatePosting={handleCreatePosting}
                isLoading={isLoading}
            />    
      </div>
  );
};

export default PostingPage;
