import React, { useState, useEffect } from 'react'
import { useChatContext } from 'stream-chat-react';
import { ResultsDropDown } from './';
import { SearchIcon } from '../assets/SearchIcon'
const ChannelSearch = ({setToggleContainer}) => {
    const { client, setActiveChannel } = useChatContext();
    const [query, Setquery] = useState('');
    const [loading, SetLoading] = useState(false);
    const [teamChannels, setTeamChannels] = useState([]);
    const [DirectChannels, setDirectChannels] = useState([]);
    useEffect(()=>{
      if(!query){
          setTeamChannels([])
          setDirectChannels([])
      }
    },[query])

    const getChannels = async (text) => {
        try {
            const channelResponse = client.queryChannels({
                type: 'team',
                name: { $autocomplete: text },
                members: { $in: [client.userID] }
            });
            const userResponse = client.queryUsers({
                id: { $ne: client.userID },
                name: { $autocomplete: text },
            })

            const [channels, { users }] = await Promise.all([channelResponse, userResponse])
            if (channels.length) setTeamChannels(channels)
            if (users.length) setDirectChannels(users)
        }
        catch (e) {
            Setquery('');
        }
    }
    const onSearch = (e) => {
        e.preventDefault();
        SetLoading(true);
        Setquery(e.target.value);
        getChannels(e.target.value);
    }
    const setChannel = (channel) => {
        Setquery('')
        setActiveChannel(channel);
    }

    return (
        <div className="channel-search__container">
            <div className="channel-search__input__wrapper">
                <div className="channel-search__input__icon">
                    <SearchIcon />
                </div>
                <input className="channel-search__input__text" placeholder="Search"
                    type="text" value={query} onChange={onSearch} />
            </div>
            {
                query &&
                (
                    <ResultsDropDown
                        teamChannels={teamChannels}
                        DirectChannels={DirectChannels}
                        loading={loading}
                        setChannel={setChannel}
                        Setquery={Setquery}
                        setToggleContainer={setToggleContainer}
                    />
                )
            }
        </div>
    )
}

export default ChannelSearch;