import { getFavoriteMovies } from '@/features/movie/helpers/movie'
import { MypageBody } from '@/features/mypage/components/MypageBody'
import { getUser } from '@/features/user/helpers/user'

export default async function Mypage() {
  const favoriteMovies = await getFavoriteMovies()
  const user = await getUser()

  return (
    <div className='flex justify-center flex-col gap-4 mb-8'>
      <div className='mt-8 text-center'>
        <h1 className='text-4xl font-bold'>Mypage</h1>
        <h2 className='text-2xl font-bold mt-4'>Favorite Movies</h2>
      </div>
      <MypageBody favoriteMovies={favoriteMovies} user={user} />
    </div>
  )
}
