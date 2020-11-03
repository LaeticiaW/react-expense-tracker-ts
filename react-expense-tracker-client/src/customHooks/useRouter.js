// useRouter custom hook that merges multiple React Router hooks into one
// From Gabe Ragland React Hooks recipes
import { useMemo } from "react";
import { useParams, useLocation, useHistory, useRouteMatch } from 'react-router-dom'
import queryString from 'query-string';

export default function useRouter() {
    const params = useParams()
    const location = useLocation()
    const history = useHistory()
    const match = useRouteMatch()

    // Return a custom router object, memoized to cache the object until something changes   
    return useMemo(() => {
        return {
            push: history.push,
            replace: history.replace,
            pathname: location.pathname,
            // Merge params and parsed query string into single "query" object       
            // Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
            query: {
                ...queryString.parse(location.search),
                ...params
            },
            match,
            location,
            history
        }
    }, [params, match, location, history])
}