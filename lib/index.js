const cheerio = require("cheerio");
const request = require("request");

//Get first 3 upcoming events from sherdog
let getUpcomingFights = function(callback){
    let events = [];
    //first
    //Getting first 3 upcoming events
    request('https://www.sherdog.com/organizations/Ultimate-Fighting-Championship-UFC-2',function(error,response,html){
        if(!error && response.statusCode == 200){
            let $ = cheerio.load(html);

            $('#upcoming_tab').filter(function(){
                
                for(let i = 2;i<5;i++){
                    
                    let el = $(this).find(`tr:nth-child(${i})`);

                    date = el.find('td:nth-child(1) span');
                    day = date.find('.day').text();
                    month = date.find('.month').text();
                    year = date.find('.year').text();

                    href = el.find('td:nth-child(2) a').attr('href');
                    url = "https://www.sherdog.com"+href;
                    title = el.find('td:nth-child(2) a span').text();

                    let event = {
                        url: url,
                        title: title,
                        day: day,
                        month: month,
                        year: year,
                        fights: []
                    };

                    events[i-2] = event;
                }
            })
        }
        getEventFighters(events);
    })
    //second
    let getEventFighters = function(events){
        for(let i = 0;i<3;i++){
            if(events[i] && events[i].url){
            request(events[i].url,function(error,response,html){
                if(!error && response.statusCode == 200){

                    let $ = cheerio.load(html);

                    $('.fight').filter(function(){
                        el = $(this);
                        fighter1 = el.find('.left_side h3 a span').text();
                        fighter2 = el.find('.right_side h3 a span').text();
                        let match = {fighter1:fighter1,fighter2:fighter2};
                        events[i].fights.push(match);
                    })

                    $('.module.event_match tr:not(.table_head)').each(function(){
                        el = $(this);

                        fighter1 = el.find('.text_right *[itemprop = name]').text();
                        fighter2 = el.find('.text_left *[itemprop = name]').text();
                        let match = {fighter1:fighter1,fighter2:fighter2};
                        events[i].fights.push(match);
                    })
                }else{
                    console.error(error);
                }
            })
        }
        }
    }
   callback(events);
}

module.exports.getUpcomingFights = getUpcomingFights;