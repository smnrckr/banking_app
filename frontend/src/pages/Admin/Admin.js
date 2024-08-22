import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import "../../components/layout/Header.css";

const AdminOperations = () => {
  const [userCampaignDetails, setUserCampaignDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedUserCode, setSelectedUserCode] = useState("");
  const [selectedCampaignCode, setSelectedCampaignCode] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true); 

  const navigate = useNavigate();

  //tabloda verilerin gösterilmesi için
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/user-campaign-table`)
      .then((response) => response.json())
      .then((json) => setUserCampaignDetails(json))
      .catch((error) => {
        console.log("Error fetching user-campaign-table data", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  //comboboxta kampanya isimlerini ve kodlarını göstermek için
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/campaigns")
      .then((response) => {
        return response.json();
      })
      .then((data) => setCampaigns(data))
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  //comboboxta kullanıcı isim ve kodlarını göstermek için
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/users")
      .then((response) => {
        return response.json();
      })
      .then((data) => setUsers(data))
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  //verileri backende göndermek için
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:8080/api/user-campaign-table`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userCode: selectedUserCode,
          campaignCode: selectedCampaignCode,
        }),
      }
    );
    if (response.ok) {
      alert("Kullanıcı kaydedildi");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  //row seçip id'i almak için
  const selectRow = (id) => {
    if (id === selectedRow) {
      setSelectedRow("");
    } else {
      setSelectedRow(id);
      setIsDisabled(true);
      setSelectedCampaignCode("");
      setSelectedUserCode("");
    }
  };

  //delete butonu
  const handleDelete = (id) => {
    fetch("http://localhost:8080/api/user-campaign-table", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    }).then(() => {
      const updatedCampaignDetails = [...userCampaignDetails].filter(
        (i) => i.id !== selectedRow
      );
      setUserCampaignDetails(updatedCampaignDetails);
      alert("Kullanıcı başarıyla silindi.");
    });
  };
  //yeni kayıta basınca olacak enabled disabled işlemleri
  const handleNewRecord = () => {
    setIsDisabled(false);
  };

  return (
    <div className="user-campaign-page-container">
      <h1>Kullanıcı Kampanya Bilgileri</h1>
      <div className="user-campaign-button-container">
        <button
          className={`user-campaign-button ${selectedRow ? "disabled" : ""}`}
          onClick={handleNewRecord}
        >
          Yeni Kayıt
        </button>
        <button
          className={`user-campaign-button ${
            !selectedRow || !isDisabled ? "disabled" : ""
          }`}
          onClick={() => handleDelete(selectedRow)}
        >
          Sil
        </button>
      </div>
      <div className="user-campaign-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Kullanıcı Kodu</th>
                <th>Kullanıcı Adı</th>
                <th>Kampanya Kodu</th>
                <th>Kampanya Adı</th>
              </tr>
            </thead>
            <tbody>
              {userCampaignDetails.map((details) => (
                <tr
                  key={details.id}
                  onClick={() => selectRow(details.id)}
                  className={selectedRow === details.id ? "selected" : ""}
                >
                  <td>{details.userCode}</td>
                  <td>{details.companyName}</td>
                  <td>{details.campaignCode}</td>
                  <td>{details.campaignName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="user-campaign-container" style={{ marginTop: "20px" }}>
        <div
          className={`admin-combo-style ${
            isDisabled || selectedRow ? "disabled" : ""
          }`}
        >
          <select
            className="admin-select"
            value={selectedUserCode}
            onChange={(e) => setSelectedUserCode(e.target.value)}
          >
            <option value="">Kullanıcı</option>
            {users.map((user, index) => (
              <option key={index} value={user.userCode}>
                {user.companyName} - {user.userCode}
              </option>
            ))}
          </select>
          <select
            className="admin-select"
            value={selectedCampaignCode}
            onChange={(e) => setSelectedCampaignCode(e.target.value)}
          >
            <option value="">Kampanya</option>
            {campaigns.map((campaign, index) => (
              <option key={index} value={campaign.campaignCode}>
                {campaign.campaignName} - {campaign.campaignCode}
              </option>
            ))}
          </select>
          <button
            className="user-campaign-button"
            onClick={handleSubmit}
            style={{ marginLeft: "5%", marginBottom: "auto" }}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOperations;
