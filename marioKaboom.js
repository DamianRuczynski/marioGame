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

scene("game", ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const maps = [
        [
            '                                                                   ',
            '                                                                   ',
            '                                                                   ',
            '                                                                   ',
            '                                                                   ',
            '            %  =*=     %                                           ',
            '                                                                   ',
            '                                           -+                      ',
            '                              ^     ^      ()                      ',
            '=============================================   ===================',
        ],
        [
            '                                                                   ',
            '                                                                   ',
            '                                                                   ',
            '                                                                   ',
            '                                                                   ',
            '      %     %  =*=     %              %  =*=     %                 ',
            '                                                                   ',
            '                                                               -+  ',
            '                     ^^       ^     ^                          ()  ',
            '=============================================   ===================',
        ],
    ]
    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('block'), solid()],

        '$': [sprite('coin'), 'coin'],
        '}': [sprite('unboxed'), solid()],

        '^': [sprite('evil-shroom'), solid(), 'dangerous'],
        '#': [sprite('mushroom'), solid(), 'mushroom', body()],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],

        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(), scale(0.5)],
    }

    const gameLevel = addLevel(maps[level], levelCfg)

    const MOVE_SPEED = 120
    const ENEMY_SPEED = 20
    const JUMP_FORCE = 360
    const BIG_JUMP_FORCE = 540
    const FALL_DEATH = 400
    let isJump = true
    let CURRENT_JUMP_FORCE = JUMP_FORCE

    const scoreLabel = add([
        text("Score: " + 0),
        pos(80, 6),
        layer('ui'),
        {
            value: 0,
        }
    ])

    add([text('level ' + parseInt(level + 1)), pos(4, 6)])

    function big() {
        let timer = 0
        let isBig = false
        return {
            update() {
                if (isBig) {
                    CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
                    timer -= dt()
                    if (timer <= 0) {
                        this.smallify()
                    }
                }
            },
            isBig() {
                return isBig
            },
            smallify() {
                CURRENT_JUMP_FORCE = JUMP_FORCE
                this.scale = vec2(1)
                timer = 0
                isBig = false
            },
            biggify(time) {
                CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
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

    action('dangerous', (d) => {
        d.move(-ENEMY_SPEED, 0)
    })

    player.collides('dangerous', (d) => {
        if (isJump) {
            destroy(d)
        } else {
            go('lose', { score: scoreLabel.value })
        }
    })

    action('mushroom', (m) => {
        m.move(20, 0)
    })

    player.on("headbump", (obj) => {
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('$', obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0, 0))
        }

        if (obj.is('mushroom-surprise')) {
            gameLevel.spawn('#', obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0, 0))
        }
    })

    player.action(() => {
        if (player.grounded()) {
            isJump = false
        }
    })

    player.action(() => {
        camPos(player.pos)
        if (player.pos.y >= FALL_DEATH) {
            go('lose', { score: scoreLabel.value })
        }
    })


    player.collides('pipe', () => {
        keyPress('down', () => {
            go('game', {
                level: (level + 1) % maps.length,
                score: scoreLabel.value
            })
        })
    })

    player.collides('mushroom', (m) => {
        destroy(m)
        player.biggify(4)
    })


    player.collides('coin', (c) => {
        destroy(c)
        scoreLabel.value++
            scoreLabel.text = "Score: " + scoreLabel.value
    })

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
    })

    keyPress('space', () => {
        if (player.grounded()) {
            isJump = true
            player.jump(CURRENT_JUMP_FORCE)
        }
    })

    scene('lose', ({ score }) => {
        add([text("You lose, your score: " + score, 24), origin('center'), pos(width() / 2, height() / 2)])
    })

    scene('finish', ({ score }) => {
        add([text("You win, your score: " + score, 24), origin('center'), pos(width() / 2, height() / 2)])
    })
})

start("game", { level: 0, score: 0 })