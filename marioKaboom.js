kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

loadRoot('https://i.imgur.com/')
loadSprite('coin', 'wbKxhcd.png')
loadSprite('evil-shroom', 'KPO3fR9.png')
loadSprite('brick', 'pogC9x5.png')
loadSprite('block', 'M6rwarW.png')
loadSprite('mario', 'Wb1qfhK.png')
loadSprite('mushroom', '0wMd92p.png')
loadSprite('surprise', 'gesQ1KP.png')
loadSprite('unboxed', 'bdrLpi6.png')
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-right', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-right', 'nqQ79eI.png')

scene("game", () => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const map = [
        '                                                                   ',
        '                                                                   ',
        '                                                                   ',
        '                                                                   ',
        '                                                                   ',
        '          %  =*=     %                                             ',
        '                                                                   ',
        '                                           -+                      ',
        '                              ^     ^      ()                      ',
        '=============================================   ===================',
    ]
    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('block'), solid()],

        '$': [sprite('coin')],
        '}': [sprite('unboxed'), solid()],

        '^': [sprite('evil-shroom'), solid()],
        '#': [sprite('mushroom'), solid()],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],

        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5)],
        '+': [sprite('pipe-top-right'), solid(), scale(0.5)],
    }

    const gameLevel = addLevel(map, levelCfg)

    const scoreLabel = add([
        text('tesstScore'),
        pos(30, 6),
        layer('ui'),
        {
            value: 'tesstsuka',
        }
    ])

    add([text('level ' + 'test', pos(4, 6))])

    function big() {
        let timer = 0
        let isBig = false
        return {
            update() {
                if (isBig) {
                    time -= dt()
                    if (timer <= 0) {
                        this.smallify()
                    }
                }
            },
            isBig() {
                return isBig
            },
            smallify() {
                this.scale = vec2(1)
                timer = 0
                isBig = false
            },
            biggify(time) {
                this.scale = vec2(2)
                timer = time
                isBig = true
            }
        }
    }

    const player = add([
        sprite('mario'), solid(),
        pos(30, 0),
        body(),
        big(),
        origin('bot'),
    ])

    const MOVE_SPEED = 120
    const JUMP_FORCE = 360

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
    })

    keyPress('space', () => {
        if (player.grounded()) {
            player.jump(JUMP_FORCE)
        }
    })
})

start("game")