import { useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  getMovieDetail,
} from 'src/services/get-data';
import helperFunctions from 'src/utils/helper-functions';

export default function useMovie(id) {
  const [data, setData] = useState({});
  const [value, setValue] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  const theme = useTheme();
  const down400 = useMediaQuery('(max-width:400px)');
  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const down970 = useMediaQuery('(max-width:970px)');

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        if (mounted) {
          setLoading(true);
        }
        const dataFetched = await getMovieDetail(id);
        if (mounted) {
          let imageGroups;
          let similarGroups;

          const down400Images = helperFunctions.group(dataFetched.images.posters, 1);
          const down400Similar = helperFunctions.group(dataFetched.similar.results, 1);

          const downSmImages = helperFunctions.group(dataFetched.images.posters, 2);
          const downSmSimilar = helperFunctions.group(dataFetched.similar.results, 2);

          const down970Images = helperFunctions.group(dataFetched.images.posters, 3);
          const down970Similar = helperFunctions.group(dataFetched.similar.results, 3);

          const biggerImages = helperFunctions.group(dataFetched.images.posters, 5);
          const biggerSimilar = helperFunctions.group(dataFetched.similar.results, 5);

          if (down400) {
            imageGroups = down400Images.slice();
            similarGroups = down400Similar.slice();
          } else if (downSm) {
            imageGroups = downSmImages.slice();
            similarGroups = downSmSimilar.slice();
          } else if (down970) {
            imageGroups = down970Images.slice();
            similarGroups = down970Similar.slice();
          } else {
            imageGroups = biggerImages.slice();
            similarGroups = biggerSimilar.slice();
          }

          dataFetched.imageGroups = imageGroups;
          dataFetched.similarGroups = similarGroups;
          dataFetched.down400Images = down400Images.slice();
          dataFetched.down400Similar = down400Similar.slice();
          dataFetched.downSmImages = downSmImages.slice();
          dataFetched.downSmSimilar = downSmSimilar.slice();
          dataFetched.down970Images = down970Images.slice();
          dataFetched.down970Similar = down970Similar.slice();
          dataFetched.biggerImages = biggerImages.slice();
          dataFetched.biggerSimilar = biggerSimilar.slice();
          setData(dataFetched);
          setError(false);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(e);
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    setLoading(true);
    if (data === undefined || helperFunctions.isObjectEmpty(data)
      || (data.similar.results.length
        === 0 && data.images.posters.length === 0 && data.videos.results.length === 0)) {
      return;
    }
    if (down400) {
      setData((prevData) => ({
        ...prevData,
        imageGroups: prevData.down400Images.slice(),
        similarGroups: prevData.down400Similar.slice(),
      }));
    } else if (downSm) {
      setData((prevData) => ({
        ...prevData,
        imageGroups: prevData.downSmImages.slice(),
        similarGroups: prevData.downSmSimilar.slice(),
      }));
    } else if (down970) {
      setData((prevData) => ({
        ...prevData,
        imageGroups: prevData.down970Images.slice(),
        similarGroups: prevData.down970Similar.slice(),
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        imageGroups: prevData.biggerImages.slice(),
        similarGroups: prevData.biggerSimilar.slice(),
      }));
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downSm, down970, down400]);

  return {
    data,
    loading,
    error,
    setData,
    value,
    setValue,
  };
}
