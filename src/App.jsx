import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageNotFound from 'src/pages/404';
import Credits from 'src/pages/credits';
import Genre from 'src/pages/genre';
import Home from 'src/pages/home';
import Latest from 'src/pages/latest';
import ListCreateForm from 'src/pages/list-create-form';
import ListEditForm from 'src/pages/list-edit-form';
import LogIn from 'src/pages/login';
import Movie from 'src/pages/movie';
import MovieOneReview from 'src/pages/movie-one-review';
import MovieReviews from 'src/pages/movie-reviews';
import Popular from 'src/pages/popular';
import RateForm from 'src/pages/rate-form';
import Rated from 'src/pages/rated';
import Registration from 'src/pages/registration';
import ReviewForm from 'src/pages/review-form';
import Search from 'src/pages/search';
import SignUp from 'src/pages/signup';
import Trending from 'src/pages/trending';
import User from 'src/pages/user';
import UserEditForm from 'src/pages/user-edit-form';
import UserLists from 'src/pages/user-lists';
import UserOneList from 'src/pages/user-one-list';
import UserRates from 'src/pages/user-rates';
import UserReviews from 'src/pages/user-reviews';
import UserWatchlist from 'src/pages/user-watchlist';
import WatchlistForm from 'src/pages/watchlist-form';
import ProtectedRoute from 'src/components/protected-route';

export default function App() {
  return (
    <div>
      <div className="app__container-page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/user/:id/lists" element={<UserLists />} />
          <Route path="/user/:userId/lists/:listId" element={<UserOneList />} />
          <Route path="/user/:id/rates" element={<UserRates />} />
          <Route path="/user/:id/reviews" element={<UserReviews />} />
          <Route path="/user/:id/watchlist" element={<UserWatchlist />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/movie/:id/reviews" element={<MovieReviews />} />
          <Route path="/movie/:movieId/reviews/:reviewId" element={<MovieOneReview />} />
          <Route
            path="/review-form"
            element={(
              <ProtectedRoute>
                <ReviewForm />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/rate-form"
            element={(
              <ProtectedRoute>
                <RateForm />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/list-create-form"
            element={(
              <ProtectedRoute>
                <ListCreateForm />
              </ProtectedRoute>
          )}
          />
          <Route
            path="/list-edit-form"
            element={(
              <ProtectedRoute>
                <ListEditForm />
              </ProtectedRoute>
              )}
          />
          <Route
            path="/watchlist-form"
            element={(
              <ProtectedRoute>
                <WatchlistForm />
              </ProtectedRoute>
              )}
          />
          <Route
            path="/user-edit-form"
            element={(
              <ProtectedRoute>
                <UserEditForm />
              </ProtectedRoute>
              )}
          />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/latest" element={<Latest />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/genre/:genres" element={<Genre />} />
          <Route path="/search/:query" element={<Search />} />
          <Route path="/rated" element={<Rated />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/credits" element={<Credits />} />
        </Routes>
      </div>
    </div>
  );
}
