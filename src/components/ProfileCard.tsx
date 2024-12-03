{/*import Card from './card.tsx';*/}
import './profileCard.css'

{/*function ProfileCard({title, subtitle,content, avatarUrl}:
     {title: string, subtitle:string,content:string, avatarUrl:string}){

        return (
            <Card title={title} subtitle={subtitle} content={content}>
                <img src={avatarUrl} alt="Profile Picture" className="profile-picture"/>
            </Card>
        )
    }*/}

function ProfileCard({title, subtitle, avatarUrl}: {title:string, subtitle:string, avatarUrl:string}){
    return (
        <div className='div-profile-card'>
            <div className='image-card'>
                <img src={avatarUrl} alt="Profile Picture" className="profile-picture"/>
            </div>
            <div>
                <h1>
                    {title}
                </h1>
                <h2>
                    {subtitle}
                </h2>
            </div>
        </div>
    )
}


export default ProfileCard