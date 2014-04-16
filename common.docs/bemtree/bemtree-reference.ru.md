<a name="intro"></a>

### Введение

**Данный документ** представляет собой справочное руководство по шаблонизатору BEMTREE.

В документе описаны:

* основные особенности BEMTREE, отличающие его от других шаблонизаторов;
* порядок обработки входных данных и генерации BEMJSON;
* примеры решения типовых задач средствами BEMTREE.

**Целевая аудитория документа** — веб-разработчики и HTML-верстальщики, использующие
[БЭМ-методологию](http://ru.bem.info/method/).

Предполагается, что читатель знаком с:

* HTML;
* JavaScript;
* CSS;
* [BEMHTML](../reference/reference.ru.md);
* [BEMJSON](../bemjson/bemjson.ru.md);
* БЭМ.



**В документе не описаны** настройка среды сборки и процедура сборки шаблонов. Процесс получения данных от бэкенда.


<a name="bemtree"></a>

### Особенности шаблонизатора BEMTREE

<a name="arch"></a>
####Архитектура шаблонизатора

Для обработки BEMTREE-шаблонов, используется модуль [bem-xjst](https://github.com/bem/bem-xjst), расширенный логикой из базового шаблона BEMTREE – [i-bem.bemtree](https://github.com/bem/bem-core/blob/v1/common.blocks/i-bem/i-bem.bemtree).

Специфическая для BEMTREE логика при этом реализована на уровне базового шаблона `i-bem.bemtree`. Базовый шаблон определяет:
* набор и порядок вызова стандартных мод;
* доступные поля контекста.

Подробнее об особенностях архитектуры BEMTREE читайте в разделе [архитектура шаблонизаторов BEMHTML и BEMTREE](../templating/template.ru.md#bemx_arch) документа по [шаблонизации данных в bem-core](../templating/template.ru.md).


<a name="uts"></a>
####Поддержка BEM-XJST-шаблонизации
BEMTREE – [BEM-XJST-шаблонизатор](../templating/template.ru.md#bemx_intro). Иначе говоря, BEMTREE использует **синтаксис-BEM-XJST** и сохраняет все особенности BEM-XJST-шаблонизаторов, такие как:
* [привязка к БЭМ-предметной области](../templating/template.ru.md#bem_area);
* [декларативные шаблоны](../templating/template.ru.md#decl_templatе);
* [язык описания и исполнения шаблонов – JavaScript](../templating/template.ru.md#language);
* [ограничения на уровне соглашений](../templating/template.ru.md#restrictions).


<a name="basic"></a>

### Основные понятия

<a name="template"></a>
#### Кратко о шаблонзации

BEMTREE – шаблонизатор рассчитанный на использование в связке с шаблонизатором BEMHTML.

BEMHTML – поэлементно преобразует входное БЭМ-дерево в выходной HTML-документ. 

Поэтому структура входного БЭМ-дерева должна быть максимально ориентирована на **представление** (view), чтобы при генерации HTML-дерева не требовалось изменять набор и порядок блоков и элементов. 

Приведение БЭМ-дерева к такому развернутому виду и является задачей технологии BEMTREE. 



<a name="data"></a>

####Схемы работы с данными

Технология BEMTREE не привязана к конкретной архитектуре взаимодействия с бэкендом. 

На практике, в BEMTREE-проектах обычно используются следующие подходы к работе с поставщиками данных:
* централизованный;
* работа на уровне BEMTREE-шаблонов блока.

Каждый из подходов обладает рядом особенностей, которые стоит учитывать при выборе схемы работы с бэкендом. 


#####Централизованное получение данных

При таком подходе, взаимодействие с бэкендом осуществляет отдельный модуль – **контроллер**. 

Контроллер по запросу от браузера (или другому событию) отправляет запрос к бэкенду и сохраняет полученный ответ. Сохранение может производиться в глобальную переменную, в свойство глобального объекта или иным образом. 

BEMTREE-шаблон блока устанавливает соответствие между полями глобального объекта или переменной и БЭМ-сущностями в результирующем BEMJSON.

Таким образом, шаблон не содержит никаких сведений о том, каким образом были получены данные. Равно как и контроллер не заботится об их дальнейшем представлении.

При таком подходе наиболее четко реализуется принцип отделения контроллера от представления данных. Это удобно для случаев, когда:
* структура и содержимое страницы известны на момент ее формирования;
* блоки не должны зависеть от схемы получения данных (например для использования во внешних проектах, библиотеках и т.д.)
* данные поставляются небольшим постоянным числом источников. Например, одной СУБД. 

***
**NB** Обратите внимание, что при централизованном подходе к работе с данными объект данных, полученный от бэкенда, должен быть полностью сформирован на момент выполнения BEMTREE-шаблона.
***


#####Получение данных внутри BEMTREE-шаблона блока

Использование такой схемы оправданно в случае, если блок получает данные от источника, которым пользуется только он сам. Тогда теряется смысл в отделении контроллера, т.к. его функциональность не востребована в других блоках. 
Примером могут послужить разнообразные виджеты: прогноз погоды, счетчики, свежие посты в блоге, курсы валют и т.д.

Основное преимущество такой схемы – высокая автономность блоков. В них содержится логика как для получения, так и для представления данных.



<a name="inputdata"></a>

#### Входные и результирующие данные: BEMJSON

Поскольку BEMTREE основан на JavaScript, стандартным форматом представления БЭМ-дерева выбрана структура данных (объект) JavaScript с набором дополнительных соглашений о представлении БЭМ-сущностей — BEMJSON.

BEMJSON служит входными и выходными данными для шаблонизатора BEMTREE. Входное БЭМ-дерево представляет собой каркас веб-страницы, который в процессе работы шаблонизатора поэлементно наполняется данными.

Входной BEMJSON может состоять из описания всего одной БЭМ-сущности, с которой начинается выполнение BEMTREE-шаблонов проекта – **точки входа**. Например, мы вызываем BEMTREE-шаблон для блока `page`:

```js
BEMTREE.apply({ block: 'page'})
```

Тогда в BEMTREE-шаблон для БЭМ-сущности – точки входа, включаются ссылки на другие БЭМ-сущности. Например:

```js
block('page').content([{ block: 'header' }, { block: 'main' }, ...])
```

В ходе обработки шаблона, шаблонизатор рекурсивно вызовет BEMTREE-шаблоны, на которые тот ссылался. Например:

```js
block('header').content([{ block: 'logo' }, { block: 'menu', content: { elem: 'item' }}])
```

Таким образом поэлементно выстраивается БЭМ-дерево всего документа.



<a name="templatebemjson"></a>

#### Шаблон, мода и контекст
Понятия **шаблона, моды и контекста** являются базовыми для BEM-XJST и полностью применимы к BEMTREE.

Вы можете ознакомиться с подробной информацией о них в соответствуюших разделах документации по шаблонизации в bem-core:
* [Шаблон](../templating/template.ru.md#template_ingeneral);
* [Мода](../templating/template.ru.md#moda);
* [Контекст](../templating/template.ru.md#context).




<a name="syntax"></a>

#### Синтаксис шаблонов

BEMTREE-шаблоны создаются с помощью [BEM-XJST-синтаксиса шаблонов]((../templating/template.ru.md#unity). 
На практике это означает, что в BEMTREE-шаблонах могут быть использованы все те же синтаксические конструкции, которые доступны в BEMHTML-шаблонах.

Все синтаксические отличия от BEMHTML заключается в доступных наборах полей контекста и стандартных мод (включая хелперы для их записи).




<a name="standardmoda"></a>

### Стандартные моды

В базовом шаблоне BEMTREE определен набор стандартных мод, которые задают порядок обхода входного БЭМ-дерева (BEMJSON) и генерации выходного BEMJSON, используемый BEMTREE по умолчанию.

По функциональности моды разделяются на два класса:

  * **«Пустая» мода** определяет алгоритм обхода узлов входного BEMJSON и вызова остальных мод;
  * Все остальные моды определяют порядок генерации выходного BEMJSON. В каждой из таких мод формируется тот или иной фрагмент выходного BEMJSON-дерева.

Для генерации BEMJSON в каждой моде вызывается процедура выбора и выполнения подходящего шаблона (предикат которого истинен
в данном контексте). Результат вычисления тела выбранного шаблона подставляется в тот фрагмент BEMJSON-дерева (БЭМ-сущность), за генерацию которого отвечает данная мода.

Данная логика работы накладывает следующие ограничения на шаблоны:

  * Если шаблон выводит какие-то данные в BEMJSON, в его предикате должна быть указана мода.
  * В предикате шаблона может быть указано не более одной моды.
  * В результате вычисления тела шаблона должен возвращаться тот тип объекта, который ожидается в рамках данной моды.

В последующих разделах моды перечислены в порядке их вызова при обработке элемента входного BEMJSON.

Моды BEMTREE полностью аналогичны модам BEMHTML, за тем исключением, что в BEMTREE отсутствуют моды, отвечающие за генерацию фрагментов HTML-элемента (класс, атрибуты и т.п.).

Таким образом, в BEMTREE-шаблонах помимо пустой моды, определяющей алгоритм обхода входного БЭМ-дерева и вызова остальных мод, доступны только две моды:

* мода `default`,  которая отвечает за генерацию элемента БЭМ-дерева в
  целом. Обычно используется для замены контекстной сущности (например, чтобы [обернуть блок в другой блок](#wrappingunit));
* мода `content`, описывающая содержимое текущего элемента БЭМ-дерева.


<a name="empty_moda"></a>

#### «Пустая» мода (`""`)

*Тип значения тела шаблона: `не используется`*

Пустая (не определенная) мода соответствует моменту, когда значение поля контекста `this._mode` равно пустой стоке
(`""`). Это значение выставляется:

  * перед началом обработки входного дерева;
  * в момент рекурсивного вызова процедуры обхода дерева в моде `default`.

Действие, выполняемое в рамках пустой моды, зависит от типа контекстного (текущего) элемента входного BEMJSON-дерева.

<table>
<tr>
    <th>Тип элемента</th>
    <th>Действие</th>
</tr>
<tr>
    <td><b>БЭМ-сущность</b>(блок или элемент)</td>
    <td>Выставление значений в служебных полях контекста (<code>block elem mods elemMods ctx position</code>)
    и вызов шаблонов по моде <code>default</code>.</td>
</tr>

<tr>
    <th>строка/число</th>
    <td>Вывод значения, приведенного к строке, в буфер BEMJSON-результата.</td>
</tr>
<tr>
    <th>Boolean, undefined, null</th>
    <td>Вывод пустой строки в буфер BEMJSON-результата.</td>
</tr>
<tr>
    <th>массив</th>
    <td>Итерация по массиву с рекурсивным вызовом шаблонов по пустой моде.</td>
</tr>
</table>

Определение шаблона по пустой моде (подпредикат `mode(this._mode === "")`) имеет смысл только в том случае, если необходимо
переопределить принцип обхода входного дерева.

Вызов шаблонов по пустой моде (конструкция `apply('')` в теле шаблона) необходим, если требуется отклониться
от однозначного соответствия «входная БЭМ-сущность — выходной BEMJSON-элемент» и сгенерировать более одного элемента на одну входную сущность. В частности, такой вызов осуществляется автоматически при использовании
[конструкции applyCtx](../templating/template.ru.md#applyctx).

**См. также**:

  * [Оборачивание блока в другой блок](#wrappingunit)

<a name="default"></a>

#### default

*Тип значения тела шаблона: `не используется`*

В рамках моды `default` полностью формируется выходной BEMJSON-элемент, соответствующий входной БЭМ-сущности.

В ходе выполнения моды `default` происходит:

  * вызов всех остальных стандартных мод, отвечающих за формирование отдельных аспектов BEMJSON-элемента;
  * объединение результатов выполнения всех вызываемых мод в результирующий BEMJSON;
  * рекурсивный вызов шаблонов на результат выполнения моды `content`.


Определение шаблона по моде `default` (подпредикат `def()`) необходимо
в тех случаях, когда нужно переопределить процедуру генерации
выходного фрагмента BEMJSON. Для примера,  создадим BEMTREE-шаблон для
блока
[page](https://github.com/bem/bem-core/blob/v2/common.blocks/page/page.bemhtml)
с уровня переопределения `common.blocks`:


```js
block('page').def()(function() {
applyCtx({
        block: this.block,
        title: this.ctx.title,
        head: [
            { elem: 'css', url: this.ctx.css, ie: false },
            { elem: 'js', url: this.ctx.js }
        ],
        content: {
            block: 'foo',
            content: this.ctx.foo
        }
    })
});
```

Здесь для модификации объекта входных данных `this.ctx` используется
конструкция `applyCtx`. С ее помощью присваиваются значения различным
полям объекта в момент вызова по моде `default`, а затем автоматически осуществляется вызов процедуры выбора и применения шаблона `apply()`. 

Шаблон формирует в контексте произвольные поля `title` и `head`, значения которых в дальнейшем используются BEMHTML-шаблоном блока.


<a name="content"></a>

#### content

* *Тип значения тела шаблона: `BEMJSON`*
* *Значение по умолчанию: `this.ctx.content`*

В рамках моды `content` вычисляется содержимое BEMJSON-элемента, в качестве которого может выступать произвольный BEMJSON
(как строка или число, так и дерево БЭМ-сущностей). В качестве значения по умолчанию используется значение поля
`content` контекстной БЭМ-сущности (`this.ctx.content`).


Определение шаблона по моде `content` (подпредикат `content()`) необходимо, если:

  * Необходимо на уровне шаблонизатора добавить содержимое для сущности, у которой отсутствует `content` во входном BEMJSON.
  * Необходимо подменить содержимое сущности на уровне шаблонизатора.

<table>
<tr>
    <th>Входные данные</th>
    <th>Шаблон</th>
    <th>результирующий BEMJSON</th>
</tr>

<tr>
    <td>
        <pre><code>{
  block: 'b1'
}</code></pre>
    </td>
    <td>
        <pre><code>block('b1').content()({
  block: 'b2'
})</code></pre>
    </td>
    <td><pre><code>{ block: 'b1', content: { block: 'b2' } }</code></pre>
</td>
</tr>
</table>


**См. также**:

* [Наследование](#inheritage)
* [Добавление БЭМ-сущностей к БЭМ-дереву](#additionbem)


<a name="context_field"></a>

### Поля контекста

В процессе работы шаблонизатор строит структуру данных, содержащую сведения об обрабатываемом узле BEMJSON и о состоянии процесса обработки. Помимо этого в контексте доступен ряд вспомогательных функций.

В момент выполнения шаблона контекст доступен в виде объекта, обозначаемого ключевым словом `this`. Обращение к контексту возможно как в предикате, так и в теле шаблона.

Автор шаблонов имеет возможность определить любые дополнительные поля в контексте.

Все поля контекста можно разделить на две категории:

  * **Контекстно-зависимые**, значение которых изменяется в зависимости от обрабатываемого узла и фазы процесса обработки.
  * **Контекстно-независимые**, значение которых постоянно.

**См. также**:

  * [Контекст](../templating/template.ru.md#context)
  

<a name="contextdependent"></a>

#### Контекстно-зависимые поля
Базовый шаблон технологии BEMTREE не добавляет никаких контекстно-зависимых полей помимо,  [общих для BEM-XJST](../templating/template.ru.md#contextdependent).


<a name="context_independent"></a>

#### Контекстно-независимые поля

Все контекстно-независимые поля сгруппированы в объекте `this._` и представляют собой вспомогательные функции, используемые при работе шаблонизатора. Автор шаблонов также может пользоваться этими функциями как в теле шаблонов, так и в предикатах.

BEMTREE расширяет набор [контекстно-независимых полей BEM-XJST](../templating/template.ru.md#context_independent) только одним методом – `this._.doAsync`.

<table>
<tr>
    <th>Поле</th>
    <th>Тип значения</th>
    <th>Описание</th>
</tr>
    <td><code>this._.doAsync(Function)</code></td>
    <td><code>Function</code></td>
    <td>Асинхронно выполняет функцию, переданную в качестве аргумента. Обычно используется для отправки асинхронных запросов к бэкенду. Функция возвращает промис, объект результата которого содержит поля с информацией о контекстной БЭМ-сущности.</td>
</tr>
</table>


<a name="examples"></a>

### Примеры и рецепты

<a name="bringing_input"></a>

#### Приведение входных данных к формату, ориентированному на представление

##### Задача

Сформировать входное БЭМ-дерево для страницы френдленты (список постов с указанием информации об авторе), удобное
для обработки в терминах шаблонов BEMHTML. Такое дерево должно быть ориентировано на представление, т.е. набор
и порядок БЭМ-сущностей должен соответствовать набору и порядку DOM-узлов выходного HTML.

##### Решение

Бэкенд обычно работает с нормализованными данными (data-ориентированный формат). В случае френдленты
формат исходных данных может быть таким:

```js
{
    posts: [ { text: 'post text 1', author: 'login1' },  { text: 'post text 2', author: 'login2' }… ],
    users:  { 'login1': { userpic: 'URL', name: 'Full Name 1' }, 'login2': { userpic: 'URL', name: 'Full Name 2' } … },
}
```

Данные представлены в нормализованном виде. В списке постов используется только идентификатор
пользователя, а полная информация о пользователе находится в соответствующем хеше в списке пользователей. Один пользователь может быть автором нескольких постов.

Формат данных, ориентированный на представление, предполагает денормализацию данных, т.е. развертывание списка постов
таким образом, чтобы в каждом посте содержалась полная информация об авторе, даже если в списке присутствует несколько
постов одного автора. В BEMJSON подобный формат может выглядеть так:

```js
{
    block: 'posts',
    content: [
        {
            block: 'post',
            content: [
                { block: 'userpic', content: 'URL' },
                { block: 'user', content: 'Full Name 1' },
                { elem: 'text', content: 'post text 1' }
            ]
        },
        {
            block: 'post',
            content: [
                { block: 'userpic', content: 'URL' },
                { block: 'user', content: 'Full Name 2' },
                { elem: 'text', content: 'post text 2' }
            ]
        },
        …
    ]
}
```

Предположим, что исходные данные сохранены в поле контекста `this.ctx.data`. Тогда BEMTREE-шаблон, осуществляющий нужное преобразование, может иметь такой вид:

```js
  block('posts').match(!this.processed).def()( 
    function() {
        var result = [],
            ctx = this.ctx,
            posts = this.ctx.data.posts;

        posts.forEach(function(post){
          var user = ctx.data.users[post.author];
          
          result.push({ 
            block: 'post',      
            content: [
                      { block: 'userpic', content: user.userpic },
                      { block: 'user', content: user.name },
                      { elem: 'text', content: post.text }
            ]    
          })
        }); 
    
        return  applyCtx({ processed: true }, { block: 'posts', content: result })
    })
```



<a name="inheritage"></a>

#### Наследование

##### Задача

На разных [уровнях переопределения](http://ru.bem.info/method/filesystem/)
определены два различных шаблона на одну и ту же БЭМ-сущность (`block b1`). Каждый из шаблонов определяет своё
содержимое по моде `content`.

Необходимо на втором уровне переопределения **унаследовать** содержимое, определённое на первом уровне, и добавить
дополнительное. Требуется аналог `<xsl:apply-imports/>`.

##### Решение
В BEMTREE есть аналог `<xsl:apply-imports/>`. Реализация основывается на возможности заново запустить в шаблоне
процедуру применения шаблонов к текущему контексту (`apply()`). Таким образом можно вызвать тот шаблон, который был
определен для данного контекста (БЭМ-сущности, моды и т.п.) ранее или на другом уровне переопределения.

При вычислении выражения `apply()` возвращается результат, полученный в ходе применения ранее определенного шаблона.
Для избежания бесконечного цикла необходимо добавить подпредикат проверки наличия в контексте какого-то флага (например,
`_myGuard`), который будет выставлен при выполнении `apply()`.

```js
// шаблон на первом уровне переопределения
block('b1').content()('text1')

// шаблон на втором уровне переопределения
block('b1').match(!this._myGuard).content()([
    apply({_myGuard:true}),  // получаем предыдущее значение content
    'text2'
])
```

В результате применения шаблонов к блоку `b1` будет получен BEMJSON:

```js
{ block: 'b1', content: 'text1text2' }
```

В качестве альтернативного решения можно использовать конструкцию `applyNext`, которая автоматически генерирует уникальное имя флага против
зацикливания.

```js
block('b1').content()('text1')

block('b1').content()([
    applyNext(), // получаем предыдущее значение content
    'text2'
])
```

**См. также**:

  * [Конструкция applyNext](../templating/template.ru.md#applynext)




<a name="wrappingunit"></a>

#### Оборачивание блока в другой блок

##### Задача

Необходимо вложить блок (`b-inner`) в другой блок (`b-wrapper`) при выполнении шаблона. Таким образом, одному входному блоку будет соответствовать два вложенных друг в друга блока.

##### Решение

При обработке блока `b-inner` в шаблоне по моде `default` (генерация целого элемента) следует модифицировать фрагмент входного дерева `this.ctx` (добавить блок `b-wrapper`).  Для этого используется конструкция `applyCtx()`, которая присваивает `this.ctx` и применяет шаблоны по пустой моде.



```js
block('b-inner').def()
    .match(!this.ctx._wrapped)(function() {
        var ctx = this.ctx;
        ctx._wrapped=true;
        applyCtx({ block: 'b-wrapper', content: ctx })
   })
```

Во избежание бесконечного цикла необходимо при вызове выражения `applyCtx()` проверять наличие в контексте специального флага (`_wrapped`), который будет выставлен при выполнении `applyCtx()`.


***
**NB** Конструкцию `applyCtx()` можно применять для **замены** БЭМ-сущности в исходном дереве, если не использовать
исходное содержимое блока (`this.ctx`) в аргументе `applyCtx()`.
***

**См. также**:

  * [Конструкция applyCtx](../templating/template.ru.md#applyctx)

<a name="additionbem"></a>

#### Добавление БЭМ-сущностей к БЭМ-дереву

##### Задача

Необходимо сверстать блок с закруглёнными уголками, работающий во всех браузерах (без использования CSS3).

Входной BEMJSON может быть таким:

```js
{ block: 'box', content: 'text' }
```

Реализация уголков требует добавления к блоку четырех дополнительных элементов.  Финальное БЭМ-дерево должно выглядеть так:

```js
{
    block: 'box',
    content: {
        elem: 'left-top',
        content: {
            elem: 'right-top',
            content: {
                elem: 'right-bottom',
                content: {
                    elem: 'left-bottom',
                    content: 'text'
                }
            }
        }
    }
}
```


##### Решение

Для модификации входного БЭМ-дерева на уровне BEMTREE потребуется написать шаблон по моде `content` для блока `box`.
Подмена фрагмента входного БЭМ-дерева (добавление необходимых элементов) выполняется с помощью конструкции `applyCtx()`,
а подстановка исходного содержимого — с помощью конструкции `applyNext()`.

BEMTREE-шаблон, выполняющий это преобразование:

```js
block('box').match(!this.ctx._processed).content()(applyCtx({'ctx._processed':true}, {
    elem: 'left-top',
    content: {
        elem: 'right-top',
        content: {
            elem: 'right-bottom',
            content: {
                elem: 'left-bottom',
                content: applyNext()
            }
        }
    }
}))
```

**NB:** Хеш с переменной `ctx._processed` в значении `true` передается методу `applyCtx` первым параметром, чтобы выполнить метод в модифицированном контексте.


**См. также**:

  * [Конструкция apply](../templating/template.ru.md#apply)
  * [Конструкция applyNext](../templating/template.ru.md#applynext)
  * [Конструкция applyCtx](../templating/template.ru.md#applyctx)
  * [Конструкция local](../templating/template.ru.md#local)


<a name="check_predicate"></a>

#### Проверка подпредикатов в определенном порядке

##### Задача

Необходимо проверять подпредикаты шаблона в строго определенном порядке, например, сначала проверить наличие в контексте
объекта `this.world`, а затем проверить значение поля в этом объекте `this.world.answer`.

##### Решение

Воспользуемся тем, что подпредикат шаблона BEMTREE может быть произвольным JavaScript-выражением и запишем его
в следующей форме:

```js
match(this.world && this.world.answer === 42)
```

Недостаток этого решения в том, что при компиляции это выражение не будет оптимизировано, что отрицательно скажется на скорости работы шаблона. В большинстве случаев можно и нужно избегать необходимости в строгом порядке проверки подпредикатов.

<a name="binding_html"></a>

#### Связывание HTML-элементов по id

##### Задача

Необходимо для входного блока `input` сгенерировать пару HTML-элементов `<label>` и `<input>`, так чтобы значение
атрибута `input@id` было сгенерировано автоматически, уникально и совпадало со значением атрибута `label@for`.

Входные данные могут выглядеть так:

```js
{
  block: 'input',
  label: 'My Input',
  content: 'my value'
}
```

##### Решение

Для генерации уникального идентификатора, подходящего в качестве значения атрибута `id`, воспользуемся вспомогательной
функцией контекста `this.generateId()`. Чтобы сгенерировать два HTML-элемента внутри одного входного блока, потребуется шаблон по моде `content`, в котором будут сформированы два необходимых элемента и их атрибуты.

```js
block('input')(
  content()([
    {
      tag: 'label',
      attrs: { 'for': this.generateId() },
      content: this.ctx.label
    },
    {
      tag: 'input',
      attrs: {
        id: this.generateId(),
        value: this.ctx.content
      }
    }
  ]
))
```

##### Послесловие
При создании BEMTREE-шаблонов можно использовать те же приемы, что и в BEMHTML. Если вы встретили интересное решение в BEMHTML-шаблоне – не стесняйтесь экспериментировать. Скорее всего, это решение может быть применено и к BEMTREE.

**См. также**:
* [Мастер-класс «Динамический БЭМ-сайт на Node.js»](http://tech.yandex.ru/events/bemup/spb-bemup/talks/1413/)
* [BEMTREE — генерируй дерево](http://tech.yandex.ru/events/bemup/yac-bemup/talks/1354/)
* [Примеры и рецепты BEMHTML](../reference/reference.ru.md#examples)
* [BEMTREE](../bemtree/bemtree-reference.ru.md/)
* [BEMHTML](../reference/reference.ru.md)
* [BEMJSON](../bemjson/bemjson.ru.md)


