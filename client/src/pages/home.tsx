import { Link } from 'react-router-dom';

type HomeProps = {
  isAuthenticated: boolean;
};

const Home = ({ isAuthenticated }: HomeProps) => {

  return (
    <div>
      <div>
        <div>
          <h1>newbie-project-jk</h1>
          {isAuthenticated ? (
            <p><Link to="/user/profile">Profile</Link></p>
          ) : (
            <>
              <p><Link to="/signup">Signup</Link></p>
              <p><Link to="/login">Login</Link></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
