import styled from "@emotion/styled";

export const GamePage = () => {
    const HEADER_HEIGHT = 8;

    const Container = styled.div({
        display: "flex",
        height: "100vh",
        flexDirection: "column",
    });

    const Header = styled.div({
        backgroundColor: "skyblue",
        height: `${HEADER_HEIGHT}vh`,
    });
    const Main = styled.div({
        backgroundColor: "pink",
        display: "flex",
        height: `${100 - HEADER_HEIGHT}vh`,
    });
    const LeftPanel = styled.div({
        backgroundColor: "red",
        width: "20%",
    });
    const CenterPanel = styled.div({
        backgroundColor: "green",
        flex: "1 1",
    });
    const RightPanel = styled.div({
        backgroundColor: "blue",
        width: "20%",
    });
    return (
        <Container>
            <Header>
                <div>test</div>
            </Header>
            <Main>
                <LeftPanel>
                    <div> test</div>
                </LeftPanel>
                <CenterPanel>
                    <div> test</div>
                </CenterPanel>
                <RightPanel>
                    <div> test</div>
                </RightPanel>
            </Main>
        </Container>
    );
};
