const testDbHelpers = {
  reviewsUser: {
    user_details: {
      username: 'userNumber0',
      photo: null,
      bio: '',
      date: '2023-06-16T18:06:44.415Z',
      lists: [
        '64502ae06dc338b6e80b8c55',
        '64502ae06dc338b6e80b8c58',
      ],
      watchlist: null,
      id: '64501354c41b5db06e01c5a4',
    },
    total: 2,
    page_size: 10,
    page: 0,
    prev_page: '',
    next_page: '',
    results: [
      {
        title: 'Second review made',
        body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitaLorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitaLorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitaLorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitaLorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vita',
        date: '2023-06-16T18:06:45.959Z',
        userId: '64501354c41b5db06e01c5a4',
        movieId: {
          name: 'The Fast and the Furious: Tokyo Drift',
          photo: 'https://image.tmdb.org/t/p/w185//cm2ffqb3XovzA5ZSzyN3jnn8qv0.jpg',
          release_date: '2006-06-03',
          idTMDB: '9615',
          rateAverage: 5,
          id: '6447e80aa1f0cd363649d595',
        },
        id: '648ca4b7bc74b10394b09134',
      },
      {
        title: 'First review made',
        body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitaLorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitaLorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitaLorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitaLorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vita',
        date: '2023-06-16T18:06:45.959Z',
        userId: '64501354c41b5db06e01c5a4',
        movieId: {
          name: 'The Fast and the Furious',
          photo: 'https://image.tmdb.org/t/p/w185//lgCEntS9mHagxdL5hb3qaV49YTd.jpg',
          release_date: '2001-06-22',
          idTMDB: '9799',
          rateAverage: 5,
          id: '6447e80aa1f0cd363649d594',
        },
        id: '64493b16236a412ea5eb6550',
      },
    ],
  },
  moviesRated: {
    total_results: 2,
    page_size: 20,
    page: 1,
    prev_page: '',
    next_page: '',
    results: [{
      name: 'The Fast and the Furious', photo: 'https://image.tmdb.org/t/p/w185//lgCEntS9mHagxdL5hb3qaV49YTd.jpg', description: "Dominic Toretto is a Los Angeles street racer suspected of masterminding a series of big-rig hijackings. When undercover cop Brian O'Conner infiltrates Toretto's iconoclastic crew, he falls for Toretto's sister and must choose a side: the gang or the LAPD.", date: '2023-06-16T18:06:45.958Z', release_date: '2001-06-22', idTMDB: '9799', rateCount: 2, rateValue: 10, rateAverage: 5, id: '6447e80aa1f0cd363649d594',
    }, {
      name: 'The Fast and the Furious: Tokyo Drift', photo: 'https://image.tmdb.org/t/p/w185//cm2ffqb3XovzA5ZSzyN3jnn8qv0.jpg', description: 'In order to avoid a jail sentence, Sean Boswell heads to Tokyo to live with his military father. In a low-rent section of the city, Shaun gets caught up in the underground world of drift racing', date: '2023-06-16T18:06:45.958Z', release_date: '2006-06-03', idTMDB: '9615', rateCount: 1, rateValue: 5, rateAverage: 5, id: '6447e80aa1f0cd363649d595',
    }],
    total_pages: 1,
  },
  moviesPopular: {
    page_size: 20,
    prev_page: '',
    next_page: 'movies/popular?page=2',
    page: 1,
    results: [{
      adult: false, backdrop_path: '/hgOvm4Vpa9PzV3hdndhAJzLrVKQ.jpg', genre_ids: [28, 80, 53], id: 385687, original_language: 'en', original_title: 'Fast X', overview: "Over many missions and against impossible odds, Dom Toretto and his family have outsmarted, out-nerved and outdriven every foe in their path. Now, they confront the most lethal opponent they've ever faced: A terrifying threat emerging from the shadows of the past who's fueled by blood revenge, and who is determined to shatter this family and destroy everything—and everyone—that Dom loves, forever.", popularity: 7626.393, poster_path: '/fiVW06jE7z9YnO4trhaMEdclSiC.jpg', release_date: '2023-05-17', title: 'Fast X', video: false, vote_average: 7.3, vote_count: 1813,
    }, {
      adult: false, backdrop_path: '/1inZm0xxXrpRfN0LxwE2TXzyLN6.jpg', genre_ids: [28, 53, 80], id: 603692, original_language: 'en', original_title: 'John Wick: Chapter 4', overview: 'With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.', popularity: 2864.933, poster_path: '/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg', release_date: '2023-03-22', title: 'John Wick: Chapter 4', video: false, vote_average: 7.9, vote_count: 3126,
    }, {
      adult: false, backdrop_path: '/9n2tJBplPbgR2ca05hS5CKXwP2c.jpg', genre_ids: [16, 10751, 12, 14, 35], id: 502356, original_language: 'en', original_title: 'The Super Mario Bros. Movie', overview: 'While working underground to fix a water main, Brooklyn plumbers—and brothers—Mario and Luigi are transported down a mysterious pipe and wander into a magical new world. But when the brothers are separated, Mario embarks on an epic quest to find Luigi.', popularity: 2311.329, poster_path: '/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg', release_date: '2023-04-05', title: 'The Super Mario Bros. Movie', video: false, vote_average: 7.8, vote_count: 4901,
    }, {
      adult: false, backdrop_path: '/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg', genre_ids: [28, 12, 16, 878], id: 569094, original_language: 'en', original_title: 'Spider-Man: Across the Spider-Verse', overview: 'After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence. But when the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders and must set out on his own to save those he loves most.', popularity: 2068.003, poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', release_date: '2023-05-31', title: 'Spider-Man: Across the Spider-Verse', video: false, vote_average: 8.7, vote_count: 1525,
    }, {
      adult: false, backdrop_path: '/9NgtktUFLm9cnFDFaekx2ROh84f.jpg', genre_ids: [28, 12, 878], id: 667538, original_language: 'en', original_title: 'Transformers: Rise of the Beasts', overview: 'When a new threat capable of destroying the entire planet emerges, Optimus Prime and the Autobots must team up with a powerful faction known as the Maximals. With the fate of humanity hanging in the balance, humans Noah and Elena will do whatever it takes to help the Transformers as they engage in the ultimate battle to save Earth.', popularity: 1681.302, poster_path: '/gPbM0MK8CP8A174rmUwGsADNYKD.jpg', release_date: '2023-06-06', title: 'Transformers: Rise of the Beasts', video: false, vote_average: 7.2, vote_count: 355,
    }, {
      adult: false, backdrop_path: '/vQ5T84t8h4N2xAswNFW9fkVIyZq.jpg', genre_ids: [9648, 53, 878], id: 536437, original_language: 'en', original_title: 'Hypnotic', overview: 'A detective becomes entangled in a mystery involving his missing daughter and a secret government program while investigating a string of reality-bending crimes.', popularity: 1562.499, poster_path: '/3IhGkkalwXguTlceGSl8XUJZOVI.jpg', release_date: '2023-05-11', title: 'Hypnotic', video: false, vote_average: 6.5, vote_count: 196,
    }, {
      adult: false, backdrop_path: '/kIX6VS5FTMURcK3WlNNkPss60e4.jpg', genre_ids: [878, 28, 12], id: 298618, original_language: 'en', original_title: 'The Flash', overview: "When his attempt to save his family inadvertently alters the future, Barry Allen becomes trapped in a reality in which General Zod has returned and there are no Super Heroes to turn to. In order to save the world that he is in and return to the future that he knows, Barry's only hope is to race for his life. But will making the ultimate sacrifice be enough to reset the universe?", popularity: 1532.206, poster_path: '/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg', release_date: '2023-06-13', title: 'The Flash', video: false, vote_average: 6.8, vote_count: 428,
    }, {
      adult: false, backdrop_path: '/dTsOvK19Brm1u2p06K7qlTyKHIi.jpg', genre_ids: [28, 10752, 53], id: 1074034, original_language: 'en', original_title: 'Ambush', overview: 'When a small outpost is ambushed, a US Army squad must take the battle below ground on a high-stakes mission in a new type of warfare the likes of which they have never seen.', popularity: 1162.239, poster_path: '/3QjtDMS7PB4SMj0nAJQiE86Lo0w.jpg', release_date: '2023-02-24', title: 'Ambush', video: false, vote_average: 5.9, vote_count: 14,
    }, {
      adult: false, backdrop_path: '/wRxLAw4l17LqiFcPLkobriPTZAw.jpg', genre_ids: [28, 53], id: 697843, original_language: 'en', original_title: 'Extraction 2', overview: "Tasked with extracting a family who is at the mercy of a Georgian gangster, Tyler Rake infiltrates one of the world's deadliest prisons in order to save them. But when the extraction gets hot, and the gangster dies in the heat of battle, his equally ruthless brother tracks down Rake and his team to Sydney, in order to get revenge.", popularity: 1653.383, poster_path: '/7gKI9hpEMcZUQpNgKrkDzJpbnNS.jpg', release_date: '2023-06-12', title: 'Extraction 2', video: false, vote_average: 7.9, vote_count: 540,
    }, {
      adult: false, backdrop_path: '/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg', genre_ids: [878, 12, 28], id: 447365, original_language: 'en', original_title: 'Guardians of the Galaxy Vol. 3', overview: 'Peter Quill, still reeling from the loss of Gamora, must rally his team around him to defend the universe along with protecting one of their own. A mission that, if not completed successfully, could quite possibly lead to the end of the Guardians as we know them.', popularity: 1016.895, poster_path: '/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', release_date: '2023-05-03', title: 'Guardians of the Galaxy Vol. 3', video: false, vote_average: 8.1, vote_count: 2006,
    }, {
      adult: false, backdrop_path: '/8rpDcsfLJypbO6vREc0547VKqEv.jpg', genre_ids: [878, 12, 28], id: 76600, original_language: 'en', original_title: 'Avatar: The Way of Water', overview: 'Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.', popularity: 1073.398, poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', release_date: '2022-12-14', title: 'Avatar: The Way of Water', video: false, vote_average: 7.7, vote_count: 8667,
    }, {
      adult: false, backdrop_path: '/35OoC3JxHXrAOg4FAa2DrPCzUX9.jpg', genre_ids: [10749, 18], id: 1010581, original_language: 'es', original_title: 'Culpa mía', overview: "Noah must leave her city, boyfriend, and friends to move into William Leister's mansion, the flashy and wealthy husband of her mother Rafaela. As a proud and independent 17 year old, Noah resists living in a mansion surrounded by luxury. However, it is there where she meets Nick, her new stepbrother, and the clash of their strong personalities becomes evident from the very beginning.", popularity: 968.495, poster_path: '/w46Vw536HwNnEzOa7J24YH9DPRS.jpg', release_date: '2023-06-08', title: 'My Fault', video: false, vote_average: 8.4, vote_count: 668,
    }, {
      adult: false, backdrop_path: '/ribiMu3iINPxDkofErPxe8jQ8L0.jpg', genre_ids: [12, 10751, 14, 10749], id: 447277, original_language: 'en', original_title: 'The Little Mermaid', overview: 'The youngest of King Triton’s daughters, and the most defiant, Ariel longs to find out more about the world beyond the sea, and while visiting the surface, falls for the dashing Prince Eric. With mermaids forbidden to interact with humans, Ariel makes a deal with the evil sea witch, Ursula, which gives her a chance to experience life on land, but ultimately places her life – and her father’s crown – in jeopardy.', popularity: 958.386, poster_path: '/ym1dxyOk4jFcSl4Q2zmRrA5BEEN.jpg', release_date: '2023-05-18', title: 'The Little Mermaid', video: false, vote_average: 6.2, vote_count: 705,
    }, {
      adult: false, backdrop_path: '/aAgGrfBwna1nO4M2USxwFgK5O0t.jpg', genre_ids: [53, 27], id: 713704, original_language: 'en', original_title: 'Evil Dead Rise', overview: 'A reunion between two estranged sisters gets cut short by the rise of flesh-possessing demons, thrusting them into a primal battle for survival as they face the most nightmarish version of family imaginable.', popularity: 906.4, poster_path: '/5ik4ATKmNtmJU6AYD0bLm56BCVM.jpg', release_date: '2023-04-12', title: 'Evil Dead Rise', video: false, vote_average: 7.1, vote_count: 1656,
    }, {
      adult: false, backdrop_path: '/gMJngTNfaqCSCqGD4y8lVMZXKDn.jpg', genre_ids: [28, 12, 878], id: 640146, original_language: 'en', original_title: 'Ant-Man and the Wasp: Quantumania', overview: "Super-Hero partners Scott Lang and Hope van Dyne, along with with Hope's parents Janet van Dyne and Hank Pym, and Scott's daughter Cassie Lang, find themselves exploring the Quantum Realm, interacting with strange new creatures and embarking on an adventure that will push them beyond the limits of what they thought possible.", popularity: 850.48, poster_path: '/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg', release_date: '2023-02-15', title: 'Ant-Man and the Wasp: Quantumania', video: false, vote_average: 6.5, vote_count: 3338,
    }, {
      adult: false, backdrop_path: '/9t0tJXcOdWwwxmGTk112HGDaT0Q.jpg', genre_ids: [27, 53], id: 890771, original_language: 'en', original_title: 'The Black Demon', overview: "Oilman Paul Sturges' idyllic family vacation turns into a nightmare when they encounter a ferocious megalodon shark that will stop at nothing to protect its territory. Stranded and under constant attack, Paul and his family must somehow find a way to get his family back to shore alive before it strikes again in this epic battle between humans and nature.", popularity: 958.033, poster_path: '/uiFcFIjig0YwyNmhoxkxtAAVIL2.jpg', release_date: '2023-04-26', title: 'The Black Demon', video: false, vote_average: 6.3, vote_count: 191,
    }, {
      adult: false, backdrop_path: '/lQwW349qRRgHUH1KkRHXAANrzJO.jpg', genre_ids: [10752, 28, 53], id: 882569, original_language: 'en', original_title: "Guy Ritchie's The Covenant", overview: 'During the war in Afghanistan, a local interpreter risks his own life to carry an injured sergeant across miles of grueling terrain.', popularity: 929.103, poster_path: '/kVG8zFFYrpyYLoHChuEeOGAd6Ru.jpg', release_date: '2023-04-19', title: "Guy Ritchie's The Covenant", video: false, vote_average: 7.6, vote_count: 593,
    }, {
      adult: false, backdrop_path: '/jr8tSoJGj33XLgFBy6lmZhpGQNu.jpg', genre_ids: [16, 10751, 14, 12, 35], id: 315162, original_language: 'en', original_title: 'Puss in Boots: The Last Wish', overview: 'Puss in Boots discovers that his passion for adventure has taken its toll: He has burned through eight of his nine lives, leaving him with only one life left. Puss sets out on an epic journey to find the mythical Last Wish and restore his nine lives.', popularity: 769.236, poster_path: '/kuf6dutpsT0vSVehic3EZIqkOBt.jpg', release_date: '2022-12-07', title: 'Puss in Boots: The Last Wish', video: false, vote_average: 8.3, vote_count: 5768,
    }, {
      adult: false, backdrop_path: '/94TIUEhuwv8PhdIADEvSuwPljS5.jpg', genre_ids: [28, 10752], id: 840326, original_language: 'fi', original_title: 'Sisu', overview: 'Deep in the wilderness of Lapland, Aatami Korpi is searching for gold but after he stumbles upon Nazi patrol, a breathtaking and gold-hungry chase through the destroyed and mined Lapland wilderness begins.', popularity: 796.89, poster_path: '/ygO9lowFMXWymATCrhoQXd6gCEh.jpg', release_date: '2023-01-27', title: 'Sisu', video: false, vote_average: 7.4, vote_count: 719,
    }, {
      adult: false, backdrop_path: '/oG6kFmxvwrOGKEmqvLNNI6lH0EO.jpg', genre_ids: [10752, 53, 28, 12, 9648, 878, 18], id: 1018494, original_language: 'en', original_title: 'Operation Seawolf', overview: 'During the last days of World War II, Germany, desperate for any last grasp to defeat the allied powers, looked to their last remaining weapons and soldiers. The German Navy and the last remaining U-Boats were formed together for one desperate last mission – a mission to attack the United States Homeland, known as Operation Seawolf. Captain Hans Kessler, a grizzled submarine commander from both World Wars, is called into service to make one mission a success and help turn the tide of the war.', popularity: 770.571, poster_path: '/eqm5EAyC9hJCN5qutuW4Ka1xYbU.jpg', release_date: '2022-10-07', title: 'Operation Seawolf', video: false, vote_average: 6.1, vote_count: 50,
    }],
    total_pages: 500,
    total_results: 10000,
  },
  movieDetail: {
    adult: false,
    backdrop_path: '/jY9ef5nqY4xIIMu3yzW3qamUCoi.jpg',
    belongs_to_collection: {
      id: 9485, name: 'The Fast and the Furious Collection', poster_path: '/yvr1Ziehgps1VJyug8nnezTJRJW.jpg', backdrop_path: '/z5A5W3WYJc3UVEWljSGwdjDgQ0j.jpg',
    },
    budget: 38000000,
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 53, name: 'Thriller' }],
    homepage: 'https://www.thefastsaga.com/fast-saga/ff1',
    id: 9799,
    imdb_id: 'tt0232500',
    original_language: 'en',
    original_title: 'The Fast and the Furious',
    overview: "Dominic Toretto is a Los Angeles street racer suspected of masterminding a series of big-rig hijackings. When undercover cop Brian O'Conner infiltrates Toretto's iconoclastic crew, he falls for Toretto's sister and must choose a side: the gang or the LAPD.",
    popularity: 8.542,
    poster_path: '/gqY0ITBgT7A82poL9jv851qdnIb.jpg',
    production_companies: [{
      id: 26281, logo_path: null, name: 'Ardustry Entertainment', origin_country: '',
    }, {
      id: 33, logo_path: '/8lvHyhjr8oUKOOy2dKXoALWKdp0.png', name: 'Universal Pictures', origin_country: 'US',
    }, {
      id: 333, logo_path: '/5xUJfzPZ8jWJUDzYtIeuPO4qPIa.png', name: 'Original Film', origin_country: 'US',
    }, {
      id: 26282, logo_path: null, name: 'Mediastream Film GmbH & Co. Productions KG', origin_country: '',
    }],
    production_countries: [{ iso_3166_1: 'DE', name: 'Germany' }, { iso_3166_1: 'US', name: 'United States of America' }],
    release_date: '2001-06-22',
    revenue: 207283925,
    runtime: 106,
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }],
    status: 'Released',
    tagline: 'Live life 1/4 mile at a time.',
    title: 'The Fast and the Furious',
    video: false,
    vote_average: 6.959,
    vote_count: 9005,
    similar: {
      page: 1,
      results: [{
        adult: false, backdrop_path: '/aPE3JGg8Bs8WQWvbiuCQ0WmXEmC.jpg', genre_ids: [37], id: 355755, original_language: 'en', original_title: 'Road Agent', overview: 'Summarily accused of murder, drifters Duke (Foran), Pancho (Carrillo) and Andy (Devine) are tossed into the hoosegow, only to be released when their alibi checks out. Far from offended by his ill treatment, Duke agrees to take the job of sheriff, retaining Pancho and Andy as his deputies. The gruesome threesome then sets about to solve a series of mysterious Wells Fargo robberies', popularity: 1.966, poster_path: '/fOOslPI6kjUSYYYNZM5wNIm36WO.jpg', release_date: '1941-12-19', title: 'Road Agent', video: false, vote_average: 0, vote_count: 0,
      }, {
        adult: false, backdrop_path: '/qUcJ0cQNcx7H61kZhWZ2jIvd0d2.jpg', genre_ids: [10749], id: 117618, original_language: 'nl', original_title: 'The Guest House', overview: "Before leaving for college, a recently dumped goth girl's life changes forever when she falls in love with a smart and professional college grad who is staying in the family's guest house.", popularity: 2.542, poster_path: '/9lgQZZTJJ2MwXynLdf7dIEj38ol.jpg', release_date: '2012-06-18', title: 'The Guest House', video: false, vote_average: 4.435, vote_count: 30,
      }, {
        adult: false, backdrop_path: null, genre_ids: [37], id: 1080119, original_language: 'en', original_title: 'South of Sonora', overview: "Bill Tracy is a Cattleman's Protective Association agent. Working undercover on his way to Sonora, a town dominated by rustlers, saves Betty Carter from a situation, but her rancher father, believing Blackie's suggestion that Bill is a rustler, forbids her to see him. Bill and his pal Heinie Schmaltz rescue each other from rustlers' various plots and ambushes and eventually discover that Blackie, Carter's foreman, is the leader of the rustlers.", popularity: 0.6, poster_path: '/utAvwVYMNqg2fZoZk3IHvwpD8gY.jpg', release_date: '1930-11-08', title: 'South of Sonora', video: false, vote_average: 0, vote_count: 0,
      }, {
        adult: false, backdrop_path: null, genre_ids: [99], id: 707026, original_language: 'en', original_title: 'Bombing L.A.', overview: "From tagging to piecing, this controversial documentary chronicles some of L.A.'s hottest graffitti writers and crews. Shot from a graffitti writers perspective, the question of whether it's art or vandalism is left for you to decide.  Segments were featured on NBC News/Today Show.", popularity: 0.6, poster_path: null, release_date: '1991-01-01', title: 'Bombing L.A.', video: false, vote_average: 0, vote_count: 0,
      }, {
        adult: false, backdrop_path: null, genre_ids: [35, 18], id: 710098, original_language: 'en', original_title: 'The 8:50 News: Exclusive Interview', overview: "In this sneak peak of the upcoming sequel to the acclaimed \"The 8:37 News\", former Hell's Angels Gang Member Is Interviewed by a less-than-competent weatherman.", popularity: 0.6, poster_path: '/u4BQF76VtP1Vd5MBh5hNh9bjTX2.jpg', release_date: '2019-10-01', title: 'The 8:50 News: Exclusive Interview', video: false, vote_average: 9, vote_count: 1,
      }, {
        adult: false, backdrop_path: '/ti8GDEpvSvXakpIE96nmdqNY18R.jpg', genre_ids: [18, 10749], id: 358895, original_language: 'en', original_title: 'Being Charlie', overview: "Charlie is a troublesome 18-year-old who breaks out of a youth drug treatment clinic, but when he returns home to Los Angeles, he's given an intervention by his parents and forced to go to an adult rehab. There, he meets a beautiful but troubled girl, Eva, and is forced to battle with drugs, elusive love and divided parents.", popularity: 7.278, poster_path: '/iYr2MGPOCNiTF5IzrO6ZmoMKbSH.jpg', release_date: '2015-09-14', title: 'Being Charlie', video: false, vote_average: 6.3, vote_count: 147,
      }, {
        adult: false, backdrop_path: '/pV0h2JM74Brgw9TrcufI7GYI2V3.jpg', genre_ids: [80, 18], id: 537104, original_language: 'en', original_title: 'The Intent 2: The Come Up', overview: 'Before the T.I.C and the Clappers crew were formed, the members worked for a ruthless Yardie boss, Beverly. One of the boys, Jay has ambitions to set up on his own. He has no money, his car keeps getting towed away, every move he makes to get money and lift himself out of the everyday struggle is unsuccessful.  Inspired by his high-flying girlfriend, Selene, he sets about laying the foundations for his own organised crime ring. Things are going seemingly well until he is arrested and Beverley discovers his hidden ambition. An ill-fated robbery after a stint in jail and a trip to Jamaica tears the crew apart. All their actions are being monitored by an undercover police officer who goes by the street name ‘Gunz’, who has been deployed by the Met Police to ingratiate himself with the crew.  With the same grit, humour and action sequences as its’ predecessor, ‘THE COME UP’ promises to follow ‘THE INTENT’ in becoming an instant cult classic but with international reach.', popularity: 2.173, poster_path: '/vS3yAm1Eck0aJMzr8V1R6oPFHKI.jpg', release_date: '2018-09-21', title: 'The Intent 2: The Come Up', video: false, vote_average: 4.1, vote_count: 9,
      }, {
        adult: false, backdrop_path: '/k2VexbaKieUVIHtQHWSgWR9wJsN.jpg', genre_ids: [99], id: 123569, original_language: 'de', original_title: 'Youth Wars – Beobachtungen in der deutschen Provinz', overview: 'A documentary about German gangs in Kiel in the early 90s.', popularity: 0.6, poster_path: '/coJzqK2bKDX2EHAOsCDoi4KjdE1.jpg', release_date: '1991-07-01', title: 'Youth Wars', video: false, vote_average: 9, vote_count: 3,
      }, {
        adult: false, backdrop_path: null, genre_ids: [10749], id: 536877, original_language: 'en', original_title: 'Katerina', overview: "KATERINA is a sweeping love story that alternates between 1992 Paris and 2017 Los Angeles. The protagonist is Jay, who is 21 when he moves to Paris to live the artist's life, and falls in love for the first time. Based on the eponymous 2018 novel by James Frey.", popularity: 0.6, poster_path: null, release_date: '', title: 'Katerina', video: false, vote_average: 0, vote_count: 0,
      }, {
        adult: false, backdrop_path: null, genre_ids: [80], id: 359677, original_language: 'en', original_title: 'Fix', overview: "An undercover cop infiltrating a small-time narcotics ring begins to wonder if he'll ever be able to get out alive.", popularity: 0.6, poster_path: null, release_date: '2014-05-13', title: 'Fix', video: false, vote_average: 0, vote_count: 0,
      }, {
        adult: false, backdrop_path: '/2vq5GTJOahE03mNYZGxIynlHcWr.jpg', genre_ids: [18, 28, 36], id: 359724, original_language: 'en', original_title: 'Ford v Ferrari', overview: 'American car designer Carroll Shelby and the British-born driver Ken Miles work together to battle corporate interference, the laws of physics, and their own personal demons to build a revolutionary race car for Ford Motor Company and take on the dominating race cars of Enzo Ferrari at the 24 Hours of Le Mans in France in 1966.', popularity: 43.885, poster_path: '/dR1Ju50iudrOh3YgfwkAU1g2HZe.jpg', release_date: '2019-11-13', title: 'Ford v Ferrari', video: false, vote_average: 8.009, vote_count: 6705,
      }, {
        adult: false, backdrop_path: '/aaK8l4iarZhB4o8jFDiusJpZexZ.jpg', genre_ids: [80], id: 706238, original_language: 'da', original_title: 'No Exit', overview: 'When a young gang member is caught dealing drugs on the side, it tests the loyalty of his friend Sami.', popularity: 1.123, poster_path: '/1ERqmCAQAUrSbwsz9ZlTREVhxEy.jpg', release_date: '2010-04-28', title: 'No Exit', video: false, vote_average: 10, vote_count: 1,
      }, {
        adult: false, backdrop_path: '/quZ2PHScBNfr4EIaaDmKrhGLWj4.jpg', genre_ids: [28], id: 706239, original_language: 'da', original_title: 'No Exit 2 – Rise Against', overview: 'Sami seeks revenge after being forced to kill his friend, and he finds a new ally.', popularity: 1.4, poster_path: '/iqBnQ6uk1BKtXkAisGpvTO6kF0L.jpg', release_date: '2013-05-21', title: 'No Exit 2 – Rise Against', video: false, vote_average: 10, vote_count: 1,
      }, {
        adult: false, backdrop_path: '/oKqsZr4Jq1Y3fPZ0ufgzUs2ToK2.jpg', genre_ids: [53, 27], id: 532870, original_language: 'en', original_title: 'Run Sweetheart Run', overview: 'A woman runs for her life though the streets of Los Angeles after her blind date suddenly turns violent.', popularity: 18.44, poster_path: '/9xf3aiAxjx2H34EwwVFFlOrr0nt.jpg', release_date: '2020-01-27', title: 'Run Sweetheart Run', video: false, vote_average: 6.044, vote_count: 124,
      }, {
        adult: false, backdrop_path: null, genre_ids: [53, 9648], id: 706475, original_language: 'en', original_title: 'Giallo A Berlino', overview: 'An Italian expat in Berlin turns amateur sleuth when a series of murders rock the German capital.', popularity: 0.6, poster_path: null, release_date: '', title: 'Giallo in Berlin', video: false, vote_average: 0, vote_count: 0,
      }, {
        adult: false, backdrop_path: null, genre_ids: [18, 12, 35], id: 355348, original_language: 'en', original_title: 'Las Gitanas', overview: 'Las Gitanas follows a group of hustlers as they dance their way through a night in Los Angeles, seducing lonely targets to expose their weaknesses and their wallets. It explores chance interactions amongst disparate souls and the common pulse that binds them.', popularity: 0.6, poster_path: '/3BjH1KbNk5yuryvOqZd0YmSwmtR.jpg', release_date: '2015-08-18', title: 'Las Gitanas', video: false, vote_average: 0, vote_count: 0,
      }, {
        adult: false, backdrop_path: null, genre_ids: [99], id: 361060, original_language: 'en', original_title: 'CarFree: Stories from the Non-Driving Life', overview: 'Winnipeg, like most North American cities, has been shaped by the automobile. City planners designed the urban environment around the idea of mobility, and the social and work life of the population followed. The car became a necessity rather than a  luxury; our environment demanded that we drive. So what does it mean, living in a car-based society, to make a conscious choice not to drive? In this new film, a number of Winnipeggers speak of this choice and the effect it has had on their lives. From mothers with young children to social activists, from artists to human rights workers, they share their reasons for choosing not to drive and the practical consequences in terms of work and social relationships.', popularity: 0.6, poster_path: null, release_date: '2015-01-10', title: 'CarFree: Stories from the Non-Driving Life', video: false, vote_average: 0, vote_count: 0,
      }, {
        adult: false, backdrop_path: null, genre_ids: [99], id: 361097, original_language: 'en', original_title: 'Last Day of Angels Flight', overview: 'A short film by Robert Kirste about the Angels Flight Railway in Bunker Hill.', popularity: 0.6, poster_path: '/sLi7hH9lp1DITPOgUvBDdOpn5J7.jpg', release_date: '1969-01-02', title: 'Last Day of Angels Flight', video: false, vote_average: 0, vote_count: 0,
      }, {
        adult: false, backdrop_path: '/54C2l69LB15TmiRLdjwaNXIFm6F.jpg', genre_ids: [18, 28], id: 125736, original_language: 'en', original_title: 'The Crowd Roars', overview: 'Famous auto racing champion Joe Greer returns to his hometown to compete in a local race, discovering that his younger brother has aspirations to become a racing champion.', popularity: 1.501, poster_path: '/o8uxqjQuAIZ4PbBkdqtEmC7pGBf.jpg', release_date: '1932-04-16', title: 'The Crowd Roars', video: false, vote_average: 5.938, vote_count: 16,
      }, {
        adult: false, backdrop_path: '/nD7NElTAf3rKFv7oP3aCMUZdG5Y.jpg', genre_ids: [35, 18], id: 536438, original_language: 'en', original_title: 'Purity', overview: 'A cam girl and her blender salesman brother navigate life in the San Fernando Valley.', popularity: 0.84, poster_path: '/clETT6yxDwYqTWtK9BBczvkKNRh.jpg', release_date: '2018-10-05', title: 'Purity', video: false, vote_average: 10, vote_count: 1,
      }],
      total_pages: 114,
      total_results: 2280,
    },
    videos: {
      results: [{
        iso_639_1: 'en', iso_3166_1: 'US', name: "The Car Chase That'll Have You on the Edge of Your Seat=", key: '9_DIry3rioQ', site: 'YouTube', size: 1080, type: 'Clip', official: true, published_at: '2023-06-17T14:00:11.000Z', id: '649022a5c2ff3d00ffbc96c8',
      }, {
        iso_639_1: 'en', iso_3166_1: 'US', name: 'Legacy Trailer', key: 'm_jWcyfjFGw', site: 'YouTube', size: 1080, type: 'Trailer', official: true, published_at: '2023-02-01T19:08:52.000Z', id: '63dabdf13dc313007d812337',
      }, {
        iso_639_1: 'en', iso_3166_1: 'US', name: 'Dominic Vs. Brian: Final Race Scene in 4K HDR', key: 'kjbcpIXp2sg', site: 'YouTube', size: 2160, type: 'Clip', official: true, published_at: '2022-12-06T20:17:10.000Z', id: '63cec839c6006d0089af378f',
      }, {
        iso_639_1: 'en', iso_3166_1: 'US', name: 'Go Time Extended Preview', key: 'FoEprTnmO28', site: 'YouTube', size: 1080, type: 'Clip', official: true, published_at: '2022-09-17T16:00:14.000Z', id: '63260b54b7fbbd007f8951c2',
      }, {
        iso_639_1: 'en', iso_3166_1: 'US', name: 'Trailer 2', key: 'HRe0LVDO9zE', site: 'YouTube', size: 480, type: 'Trailer', official: false, published_at: '2015-12-18T18:12:49.000Z', id: '61f46063d71fb4004493abff',
      }, {
        iso_639_1: 'en', iso_3166_1: 'US', name: 'Official Trailer', key: 'ZsJz2TJAPjw', site: 'YouTube', size: 720, type: 'Trailer', official: true, published_at: '2014-10-31T21:03:12.000Z', id: '5dd2f87f57d3780013dc01ad',
      }],
    },
    images: {
      backdrops: [{
        aspect_ratio: 1.778, height: 1080, iso_639_1: null, file_path: '/jY9ef5nqY4xIIMu3yzW3qamUCoi.jpg', vote_average: 5.516, vote_count: 16, width: 1920,
      }, {
        aspect_ratio: 1.778, height: 1080, iso_639_1: null, file_path: '/ibZ3CHL01rU0n3TkMiDzObBZjIn.jpg', vote_average: 5.384, vote_count: 2, width: 1920,
      }, {
        aspect_ratio: 1.778, height: 1080, iso_639_1: null, file_path: '/7sHktJV6gpffCVtuzb3l0YGmJu7.jpg', vote_average: 5.326, vote_count: 7, width: 1920,
      }, {
        aspect_ratio: 1.778, height: 1080, iso_639_1: 'en', file_path: '/s4QnMxViXbBRL1z41dRR1vsgdBg.jpg', vote_average: 5.312, vote_count: 1, width: 1920,
      }, {
        aspect_ratio: 1.778, height: 2160, iso_639_1: 'en', file_path: '/1rFSuT2dlDVa9he7NSD6fo3D8AJ.jpg', vote_average: 5.312, vote_count: 1, width: 3840,
      }, {
        aspect_ratio: 1.778, height: 2160, iso_639_1: null, file_path: '/gH8pdqF9H3xzYjtSrz4xZt1rLpJ.jpg', vote_average: 5.258, vote_count: 6, width: 3840,
      }, {
        aspect_ratio: 1.778, height: 1080, iso_639_1: null, file_path: '/spQeQgmeKDaOnDV0g20x3n0fG2D.jpg', vote_average: 5.252, vote_count: 4, width: 1920,
      }, {
        aspect_ratio: 1.778, height: 720, iso_639_1: null, file_path: '/48UNZSGGViU1m9DcfpKZKMxBaI7.jpg', vote_average: 5.246, vote_count: 2, width: 1280,
      }, {
        aspect_ratio: 1.778, height: 1080, iso_639_1: null, file_path: '/rw2IEFtqAkCu4eXdSCsPowkEjWs.jpg', vote_average: 5.246, vote_count: 2, width: 1920,
      }, {
        aspect_ratio: 1.778, height: 720, iso_639_1: null, file_path: '/vDcs0nrtSzaX3ZaJT69XA8IJfM6.jpg', vote_average: 5.246, vote_count: 2, width: 1280,
      }, {
        aspect_ratio: 1.778, height: 1080, iso_639_1: null, file_path: '/oFUGuWhjfnUiiiLgETiIJXTukgE.jpg', vote_average: 5.246, vote_count: 2, width: 1920,
      }, {
        aspect_ratio: 1.778, height: 1080, iso_639_1: null, file_path: '/sK707RANdnKSRmLm4FfCTRjZunR.jpg', vote_average: 5.246, vote_count: 2, width: 1920,
      }, {
        aspect_ratio: 1.778, height: 1102, iso_639_1: null, file_path: '/y6fofLFEeJNK5z0C22kP62eHMhK.jpg', vote_average: 5.18, vote_count: 3, width: 1959,
      }, {
        aspect_ratio: 1.778, height: 1080, iso_639_1: null, file_path: '/oLIbpTA8I5GZnvpHZ1yVXFbYfqZ.jpg', vote_average: 5.172, vote_count: 1, width: 1920,
      }, {
        aspect_ratio: 1.778, height: 1080, iso_639_1: null, file_path: '/4IeCuava1Ourh9pZvHGX9yANLTC.jpg', vote_average: 5.172, vote_count: 1, width: 1920,
      }, {
        aspect_ratio: 1.778, height: 1080, iso_639_1: 'en', file_path: '/AqWOz2XamtSe1mJVQ7QcLqLkV8Y.jpg', vote_average: 5.172, vote_count: 1, width: 1920,
      }, {
        aspect_ratio: 1.778, height: 2160, iso_639_1: 'en', file_path: '/AvQ2PUhp5wlPWZzGQYBqvEP8laW.jpg', vote_average: 5.172, vote_count: 1, width: 3840,
      }, {
        aspect_ratio: 1.778, height: 720, iso_639_1: null, file_path: '/gkV2N5pSz82rpOQVQtu0tGSn2HJ.jpg', vote_average: 0, vote_count: 0, width: 1280,
      }, {
        aspect_ratio: 1.778, height: 720, iso_639_1: null, file_path: '/mPqpSAeWdsFe7td83nb9QM5fVde.jpg', vote_average: 0, vote_count: 0, width: 1280,
      }, {
        aspect_ratio: 1.778, height: 720, iso_639_1: null, file_path: '/tycz67bg7H103KxHIl0UtBmTzwS.jpg', vote_average: 0, vote_count: 0, width: 1280,
      }, {
        aspect_ratio: 1.778, height: 2160, iso_639_1: null, file_path: '/yQSEE27dTvdCqZkq9sQGgm2nfyC.jpg', vote_average: 0, vote_count: 0, width: 3840,
      }, {
        aspect_ratio: 1.778, height: 2160, iso_639_1: 'en', file_path: '/5jjKyv2U5Q4aCjH2qmXCheSk4wN.jpg', vote_average: 0, vote_count: 0, width: 3840,
      }],
      logos: [{
        aspect_ratio: 3.662, height: 216, iso_639_1: 'en', file_path: '/jCbjdbiG1BtiX4aqhvgf6YdXuIq.png', vote_average: 5.312, vote_count: 1, width: 791,
      }, {
        aspect_ratio: 3.662, height: 216, iso_639_1: 'en', file_path: '/wzUVHpzYooGYcTqjCRQmtDTWB45.png', vote_average: 0, vote_count: 0, width: 791,
      }, {
        aspect_ratio: 3.008, height: 252, iso_639_1: 'en', file_path: '/L2FUkC1L2DsIiBsQ2cBMvXEPzH.png', vote_average: 0, vote_count: 0, width: 758,
      }, {
        aspect_ratio: 2.832, height: 279, iso_639_1: 'en', file_path: '/kf17mvLnyFitDBoCm6ymISDfkxF.png', vote_average: 0, vote_count: 0, width: 790,
      }, {
        aspect_ratio: 3.072, height: 292, iso_639_1: 'en', file_path: '/xgZj7S2rwDamoQbgvkB9HGAuQ6x.png', vote_average: 0, vote_count: 0, width: 897,
      }, {
        aspect_ratio: 3.008, height: 252, iso_639_1: 'en', file_path: '/xQpQ8mCNhQp7ac6LP8d5U0UbWPW.png', vote_average: 0, vote_count: 0, width: 758,
      }, {
        aspect_ratio: 2.832, height: 279, iso_639_1: 'en', file_path: '/vYgfqIL8vfmgOO4ogkwGakaYL6I.png', vote_average: 0, vote_count: 0, width: 790,
      }, {
        aspect_ratio: 2.838, height: 1257, iso_639_1: 'en', file_path: '/oJok5TUr1fwc5STfL8E4BblGPMU.png', vote_average: 0, vote_count: 0, width: 3567,
      }],
      posters: [{
        aspect_ratio: 0.667, height: 3000, iso_639_1: 'en', file_path: '/gqY0ITBgT7A82poL9jv851qdnIb.jpg', vote_average: 5.394, vote_count: 10, width: 2000,
      }, {
        aspect_ratio: 0.667, height: 3000, iso_639_1: 'en', file_path: '/gbwSGMc37e7bXi2Hgu3lI6WnL24.jpg', vote_average: 5.384, vote_count: 2, width: 2000,
      }, {
        aspect_ratio: 0.667, height: 1920, iso_639_1: 'en', file_path: '/BbvBMdrQ1SvnLTg5VRb7nojhNo.jpg', vote_average: 5.312, vote_count: 1, width: 1280,
      }, {
        aspect_ratio: 0.669, height: 1475, iso_639_1: 'en', file_path: '/rBhsSOlBgnP2IV2DULN1s0eD5JP.jpg', vote_average: 5.312, vote_count: 1, width: 987,
      }, {
        aspect_ratio: 0.667, height: 3000, iso_639_1: 'en', file_path: '/qopOpHvJQbLr3Svys9IFJD6IAE.jpg', vote_average: 5.312, vote_count: 1, width: 2000,
      }, {
        aspect_ratio: 0.667, height: 3000, iso_639_1: 'en', file_path: '/5En3O5t9LG8PfRaNs3vKfMdjQ1B.jpg', vote_average: 5.27, vote_count: 10, width: 2000,
      }, {
        aspect_ratio: 0.667, height: 1500, iso_639_1: 'en', file_path: '/lgCEntS9mHagxdL5hb3qaV49YTd.jpg', vote_average: 5.264, vote_count: 8, width: 1000,
      }, {
        aspect_ratio: 0.67, height: 1200, iso_639_1: 'en', file_path: '/mpLch4WuARCqDIw0rVRyCJXO7d5.jpg', vote_average: 5.246, vote_count: 2, width: 804,
      }, {
        aspect_ratio: 0.667, height: 3000, iso_639_1: 'en', file_path: '/jHIDFIAGD9XGbrwNmwrwRqL1ram.jpg', vote_average: 5.246, vote_count: 2, width: 2000,
      }, {
        aspect_ratio: 0.667, height: 1500, iso_639_1: 'en', file_path: '/4L0cE8ZE2FOsDjoX0f4w0aGhpER.jpg', vote_average: 5.246, vote_count: 2, width: 1000,
      }, {
        aspect_ratio: 0.667, height: 3000, iso_639_1: 'en', file_path: '/yDnc6wlavp1f8Ndkm1SLdGNYazU.jpg', vote_average: 5.19, vote_count: 5, width: 2000,
      }, {
        aspect_ratio: 0.68, height: 1000, iso_639_1: 'en', file_path: '/bvXWpBCxLrNml0oCJory9KaMoBT.jpg', vote_average: 5.19, vote_count: 5, width: 680,
      }, {
        aspect_ratio: 0.666, height: 1000, iso_639_1: 'en', file_path: '/izpO0NlxQ4l7cuWS2t9LVrr7iIO.jpg', vote_average: 5.18, vote_count: 3, width: 666,
      }, {
        aspect_ratio: 0.667, height: 1500, iso_639_1: 'en', file_path: '/lFtnSgkNTbXu6MfEMCmKzUHDyAr.jpg', vote_average: 5.18, vote_count: 3, width: 1000,
      }, {
        aspect_ratio: 0.667, height: 1200, iso_639_1: 'en', file_path: '/snEa8yGOj8wFI3q4SSLoQpmRZix.jpg', vote_average: 5.18, vote_count: 3, width: 800,
      }, {
        aspect_ratio: 0.667, height: 3000, iso_639_1: null, file_path: '/tcThBdeERMhXt4fW5RM0R1Fe6K.jpg', vote_average: 5.18, vote_count: 3, width: 2000,
      }, {
        aspect_ratio: 0.667, height: 3000, iso_639_1: 'en', file_path: '/iN8fyCyp4pZmnnNYtOThSdYFksT.jpg', vote_average: 5.172, vote_count: 1, width: 2000,
      }, {
        aspect_ratio: 0.667, height: 1200, iso_639_1: 'en', file_path: '/o8ynkuomYM60ZI92tIiuA7PVzcY.jpg', vote_average: 5.106, vote_count: 2, width: 800,
      }, {
        aspect_ratio: 0.677, height: 1477, iso_639_1: 'en', file_path: '/wivAiY8DRAVL7Cn7aOnUO0i1CJR.jpg', vote_average: 0, vote_count: 0, width: 1000,
      }, {
        aspect_ratio: 0.667, height: 2100, iso_639_1: 'en', file_path: '/wlkEMqUW8nzyFM16Mycpzx3eDVG.jpg', vote_average: 0, vote_count: 0, width: 1400,
      }, {
        aspect_ratio: 0.667, height: 2100, iso_639_1: 'en', file_path: '/pkp7SZhFXyTGoaFOcKEyq801jT9.jpg', vote_average: 0, vote_count: 0, width: 1400,
      }, {
        aspect_ratio: 0.667, height: 1500, iso_639_1: 'en', file_path: '/pZROVk4WBXvjzDks76a8gRRnWMj.jpg', vote_average: 0, vote_count: 0, width: 1000,
      }, {
        aspect_ratio: 0.667, height: 3000, iso_639_1: 'en', file_path: '/rErVUUjSpCL4DqRyyyHQDAHKzBx.jpg', vote_average: 0, vote_count: 0, width: 2000,
      }, {
        aspect_ratio: 0.667, height: 3000, iso_639_1: 'en', file_path: '/ogTxbiWaxwWZkob854bDWY8UIbE.jpg', vote_average: 0, vote_count: 0, width: 2000,
      }, {
        aspect_ratio: 0.667, height: 2100, iso_639_1: 'en', file_path: '/9OxuDVo2qWQ0txatmezb9sbLRIe.jpg', vote_average: 0, vote_count: 0, width: 1400,
      }, {
        aspect_ratio: 0.675, height: 948, iso_639_1: 'en', file_path: '/1d1dQlIUmzPaVtw3abbpkV5xPrH.jpg', vote_average: 0, vote_count: 0, width: 640,
      }, {
        aspect_ratio: 0.667, height: 1500, iso_639_1: 'en', file_path: '/moiqR5v2oGv1iBjtn4D4d0QNdFS.jpg', vote_average: 0, vote_count: 0, width: 1000,
      }, {
        aspect_ratio: 0.667, height: 1500, iso_639_1: 'en', file_path: '/1yXV6TEU3fKSYHs7zkcBCX8o7gn.jpg', vote_average: 0, vote_count: 0, width: 1000,
      }, {
        aspect_ratio: 0.667, height: 1500, iso_639_1: 'en', file_path: '/o3rMZpCZvousPId6fF1UGaho38r.jpg', vote_average: 0, vote_count: 0, width: 1000,
      }, {
        aspect_ratio: 0.667, height: 3000, iso_639_1: null, file_path: '/hcCH4a2j92bCAMxfFyoNEIqkHBj.jpg', vote_average: 0, vote_count: 0, width: 2000,
      }],
    },
    movieDB: {
      name: 'The Fast and the Furious', photo: 'https://image.tmdb.org/t/p/w185//lgCEntS9mHagxdL5hb3qaV49YTd.jpg', description: "Dominic Toretto is a Los Angeles street racer suspected of masterminding a series of big-rig hijackings. When undercover cop Brian O'Conner infiltrates Toretto's iconoclastic crew, he falls for Toretto's sister and must choose a side: the gang or the LAPD.", date: '2023-06-16T18:06:45.958Z', release_date: '2001-06-22', idTMDB: '9799', rateCount: 2, rateValue: 10, rateAverage: 5, id: '6447e80aa1f0cd363649d594', reviews: 2,
    },
  },

};

export default testDbHelpers;
