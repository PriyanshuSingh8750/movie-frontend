import Hero from '../hero/Hero';

const Home = ({movies = []}) => {
  console.log("Movies prop in Home component:", movies); 
    return (
      <Hero movies = {movies} />
    )
}
export default Home