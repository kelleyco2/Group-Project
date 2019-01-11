import React, { Component } from 'react'
import Axios from 'axios' 
import TMDB_api_key from '../../../TMDB_api_key'
import { connect } from 'react-redux';
import { getInfo } from '../../../ducks/reducer'
import { Link } from 'react-router-dom'
import './DriveMovies.css'

class Movies extends Component {
  constructor(){
    super()

    this.state = {
        moviePosters: [],
        years: [],
        titles: [],
        movies: [],
        popularity: [],
        releaseDate: [],
        rating: []      }
  }

    
      componentDidMount(){
        Axios.get('/files').then(res => {
          this.setState({
            movies: res.data,
          })
          let years = res.data.map(movie => {
            let noUnderScores = movie.name.replace(/_/g, ' ')
            let noFileFormat = noUnderScores.replace(/.mp4|.mkv/g, '')
            let year = noFileFormat.replace(/[^0-9]/ig, '')
            let years = []
            years.push(year)
            return years
          })
          let allYears = years.map(year => {
            return year[0] 
          })
          this.setState({
            years: allYears
          })

          let titles = res.data.map(movie => {
            let noUnderScores = movie.name.replace(/_/g, ' ')
            let noFileFormat = noUnderScores.replace(/.mp4|.mkv/g, '')
            let queryString = noFileFormat.replace(/[0-9]|[()]/ig, '')
            let noSpaces = queryString.replace(/\s/g, '%20')
            let titles = []
            titles.push(noSpaces)
            return titles
          })
          let allTitles = titles.map(title => {
            return title[0]
          })
          this.setState({
            titles: allTitles
          })


          
          let posters = res.data.map(movie => {
            let id = movie.id
            let noUnderScores = movie.name.replace(/_/g, ' ')
            let noFileFormat = noUnderScores.replace(/.mp4|.mkv/g, '')
            let queryString = noFileFormat.replace(/[0-9]|[()]/ig, '')
            let noSpaces = queryString.replace(/\s/g, '%20')
            let year = noFileFormat.replace(/[^0-9]/ig, '')
            return Axios.get(`https://api.themoviedb.org/3/search/movie?year=${year}&include_adult=false&page=1&query=${noSpaces}&language=en-US&api_key=${TMDB_api_key.tmdb}`).then(res => {
                let moviePosters = []
                moviePosters.push({
                  poster: `https://image.tmdb.org/t/p/original${res.data.results[0].poster_path}`,
                  popularity: res.data.results[0].popularity,
                  releaseDate: res.data.results[0].release_date,
                  rating: res.data.results[0].vote_average,
                  year: year,
                  title: noSpaces,
                  id
                })
                return moviePosters
              })
          })
          Promise.all(posters).then(res => {
            let posters = res.map(data => {
              return {
                poster: data[0].poster,
                popularity: data[0].popularity,
                releaseDate: data[0].releaseDate,
                rating: data[0].rating,
                year: data[0].year,
                title: data[0].title,
                id: data[0].id
              }
            })
            this.setState({
              moviePosters: posters
            })
          })
        })
      }

      componentDidUpdate(prevState){
        if(this.state.moviePosters !== prevState.moviePosters){

        }
      }

      comparePopularity = (a,b) => {
        if(a.popularity > b.popularity){
              return -1
            }
            if(a.popularity < b.popularity){
              return 1
            }
            return 0
      }

      compareRating = (a,b) => {
        if(a.rating > b.rating){
              return -1
            }
            if(a.rating < b.rating){
              return 1
            }
            return 0
      }

      compareReleaseDate = (a,b) => {
        if(a.releaseDate > b.releaseDate){
              return -1
            }
            if(a.releaseDate < b.releaseDate){
              return 1
            }
            return 0
      }



  render() {
    return (
      <div className='drivemovies'>
        <div className='button-container'>
          <button
          onClick={() => (this.setState({
            moviePosters: [ ...this.state.moviePosters ].sort(this.comparePopularity)
          }))}
          >
            Popular
          </button>

          <button
          onClick={() => (this.setState({
            moviePosters: [ ...this.state.moviePosters ].sort(this.compareRating)
          }))}
          >
            Rating
          </button>
          
          <button
          onClick={() => (this.setState({
            moviePosters: [ ...this.state.moviePosters ].sort(this.compareReleaseDate)
          }))}
          >
            Release Date
          </button>
        </div>
        
        <div className='poster-container'>
          {this.state.moviePosters.map((poster, i) => {
            console.log(poster)
            return (
              <div key={i}>
              <Link to='/MovieInfo'>
                <img src={poster.poster} alt="" width='188px' height='279px' onClick={() => {
                  this.props.getInfo({
                    year: poster.year,
                    title: poster.title,
                    id: poster.id
                  })
                }}/>
              </Link>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default connect(null, { getInfo })(Movies)