import FileUploader from "../components/FileUploader";
import "../assets/styles/Home.css"; 

const Home = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">Bem-vindo ao Splitr</h1>
      <FileUploader />
    </div>
  );
};

export default Home;
